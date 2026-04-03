import { Injectable, Logger } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import {
  EnqueueAccountCreatedEmailArgs,
  EnqueueTimeOffStatusEmailArgs,
  SesSendEmailArgs,
} from '@repo/types';

class ConcurrencyQueue {
  private running = 0;
  private readonly queue: Array<() => Promise<void>> = [];

  constructor(
    private readonly concurrency: number,
    private readonly onError: (err: unknown) => void,
  ) {}

  add(job: () => Promise<void>) {
    this.queue.push(job);
    // Pump asynchronously so enqueue never blocks the caller.
    void this.pump();
  }

  private async pump() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) return;
      this.running += 1;

      job()
        .catch((err) => this.onError(err))
        .finally(() => {
          this.running -= 1;
          void this.pump();
        });
    }
  }
}

function sha256Hex(input: string) {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function hmacHex(key: string | Buffer, data: string) {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

function percentEncodeRFC3986(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

function buildCanonicalQueryString(pairs: Array<[string, string]>) {
  const encoded = pairs.map(([k, v]) => [
    percentEncodeRFC3986(k),
    percentEncodeRFC3986(v),
  ]);

  encoded.sort((a, b) => {
    if (a[0] === b[0]) return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
    return a[0] < b[0] ? -1 : 1;
  });

  return encoded.map(([ek, ev]) => `${ek}=${ev}`).join('&');
}

function getXmlTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`));
  return match?.[1] ?? null;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly region: string;
  private readonly sesEndpoint: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly sessionToken?: string;
  private readonly fromEmail: string | undefined;

  private readonly queue: ConcurrencyQueue;

  constructor() {
    this.region = process.env.AWS_REGION || process.env.SES_REGION || 'us-east-1';
    this.sesEndpoint =
      process.env.SES_ENDPOINT || `https://email.${this.region}.amazonaws.com`;

    // For LocalStack you can set these to "test"/whatever your container expects.
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'test';
    this.secretAccessKey =
      process.env.AWS_SECRET_ACCESS_KEY || 'test';
    this.sessionToken = process.env.AWS_SESSION_TOKEN;
    this.fromEmail = process.env.SES_FROM_EMAIL!;

    const concurrency = Number(process.env.EMAIL_SEND_CONCURRENCY || 2);
    this.queue = new ConcurrencyQueue(concurrency, (err) => {
      this.logger.error('Email send job failed', err);
    });
  }

  enqueueAccountCreatedEmail(args: EnqueueAccountCreatedEmailArgs) {
    if (!this.fromEmail) {
      this.logger.warn(
        'SES_FROM_EMAIL not configured; skipping account-created email.',
      );
      return;
    }

    if (!args.toEmail) return;

    this.queue.add(async () => {
      await this.sendSesEmail({
        toEmail: args.toEmail,
        fromEmail: this.fromEmail!,
        subject: 'Your HR Tool account has been created',
        textBody: [
          `Hi ${args.firstName},`,
          '',
          'Your HR Tool account has been created.',
          `Login email: ${args.accountEmail}`,
          `Temporary password: ${args.tempPassword}`,
          '',
          'Please log in and change your password as soon as possible.',
        ].join('\n'),
        htmlBody: `
          <p>Hi ${args.firstName},</p>
          <p>Your HR Tool account has been created.</p>
          <ul>
            <li><b>Login email:</b> ${args.accountEmail}</li>
            <li><b>Temporary password:</b> ${args.tempPassword}</li>
          </ul>
          <p>Please log in and change your password as soon as possible.</p>
        `,
      });
    });
  }

  enqueueTimeOffStatusEmail(args: EnqueueTimeOffStatusEmailArgs) {
    if (!this.fromEmail) {
      this.logger.warn(
        'SES_FROM_EMAIL not configured; skipping time-off status email.',
      );
      return;
    }

    if (!args.toEmail) return;

    const statusText = args.status.toLowerCase();
    const dateRange = `${args.startDate.toDateString()} to ${args.endDate.toDateString()}`;

    this.queue.add(async () => {
      await this.sendSesEmail({
        toEmail: args.toEmail,
        fromEmail: this.fromEmail!,
        subject: `Your time off request has been ${statusText}`,
        textBody: [
          `Hi ${args.firstName},`,
          '',
          `Your ${args.leaveType} request for ${dateRange} has been ${statusText}.`,
          '',
          'Best regards,',
          'HR Team',
        ].join('\n'),
        htmlBody: `
          <p>Hi ${args.firstName},</p>
          <p>Your <strong>${args.leaveType}</strong> request for <strong>${dateRange}</strong> has been <strong>${statusText}</strong>.</p>
          <p>Best regards,<br />HR Team</p>
        `,
      });
    });
  }

  async sendSesEmail(args: SesSendEmailArgs) {
    const params: Record<string, string> = {
      Action: 'SendEmail',
      Version: '2010-12-01',
      Source: args.fromEmail,
      'Destination.ToAddresses.member.1': args.toEmail,
      'Message.Subject.Data': args.subject,
      'Message.Body.Text.Data': args.textBody,
    };

    if (args.htmlBody) {
      params['Message.Body.Html.Data'] = args.htmlBody;
    }

    const url = new URL(this.sesEndpoint);
    const host = url.host;

    const now = new Date();
    const amzDate = toAmzDate(now);
    const dateStamp = toDateStamp(now);

    const canonicalQueryString = buildCanonicalQueryString(
      Object.entries(params) as Array<[string, string]>,
    );

    const canonicalUri = url.pathname || '/';
    const canonicalHeaders: Array<[string, string]> = [
      ['host', host],
      ['x-amz-date', amzDate],
    ];
    if (this.sessionToken) {
      canonicalHeaders.push(['x-amz-security-token', this.sessionToken]);
    }
    canonicalHeaders.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

    const signedHeaders = canonicalHeaders.map(([k]) => k).join(';');

    const canonicalHeadersStr = canonicalHeaders
      .map(([k, v]) => `${k.toLowerCase()}:${String(v).trim()}\n`)
      .join('');

    const payloadHash = sha256Hex('');

    const canonicalRequest = [
      'GET',
      canonicalUri,
      canonicalQueryString,
      canonicalHeadersStr,
      signedHeaders,
      payloadHash,
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.region}/ses/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      sha256Hex(canonicalRequest),
    ].join('\n');

    // Derive signing key
    const kDate = hmacHex(`AWS4${this.secretAccessKey}`, dateStamp);
    const kRegion = hmacHex(kDate, this.region);
    const kService = hmacHex(kRegion, 'ses');
    const kSigning = hmacHex(kService, 'aws4_request');
    const signature = createHmac('sha256', kSigning)
      .update(stringToSign, 'utf8')
      .digest('hex');

    const authorization = `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const headers: Record<string, string> = {
      host,
      'x-amz-date': amzDate,
      Authorization: authorization,
    };
    if (this.sessionToken) {
      headers['x-amz-security-token'] = this.sessionToken;
    }

    const requestUrl = `${url.origin}${canonicalUri}?${canonicalQueryString}`;

    const res = await fetch(requestUrl, { method: 'GET', headers });
    const body = await res.text();

    if (!res.ok) {
      throw new Error(`SES send failed (${res.status}): ${body.slice(0, 400)}`);
    }

    const messageId = getXmlTag(body, 'MessageId');
    this.logger.debug(`SES send ok. MessageId=${messageId ?? 'n/a'}`);
  }
}

function toAmzDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function toDateStamp(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate())
  );
}
