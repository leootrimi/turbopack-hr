import { Injectable } from '@nestjs/common';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentForm, EquipmentRow } from '@repo/types';
import { DrizzleService } from 'src/database/drizzle.provider';
import { equipment, purchaseInfo, employee, users } from 'src/database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class EquipmentsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createEquipmentDto: EquipmentForm) {
    const { basic, purchase, assignment } = createEquipmentDto;

    const equipmentInfo = {
      ...basic,
      location: assignment?.location || 'Office',
      category: basic.category || 'Other',
    };

    try {
      const [equipmentInserted] = await this.drizzle.db
        .insert(equipment)
        .values(equipmentInfo)
        .returning();

      const [purchaseInserted] = await this.drizzle.db
        .insert(purchaseInfo)
        .values({
          equipmentId: equipmentInserted.id,
          purchaseDate: purchase.purchaseDate
            ? new Date(purchase.purchaseDate)
            : null,
          warrantyExpiration: purchase.warrantyExpiration
            ? new Date(purchase.warrantyExpiration)
            : null,
          purchaseCost: purchase.purchaseCost
            ? Number(purchase.purchaseCost)
            : null,
          supplier: purchase.supplier,
          condition: purchase.condition,
          status: purchase.status,
        })
        .returning();

      return {
        equipment: equipmentInserted,
        purchase: purchaseInserted,
      };
    } catch (error) {
      console.error('Error inserting equipment:', error);
      throw error;
    }
  }

  async findAll(): Promise<EquipmentRow[]> {
    const equipments: EquipmentRow[] = await this.drizzle.db
      .select({
        id: equipment.id,
        name: equipment.name,
        category: equipment.category,
        brand: equipment.brand,
        model: equipment.model,
        assetTag: equipment.assetTag,
        assignedTo: equipment.assignedTo,
        status: purchaseInfo.status,
        condition: purchaseInfo.condition,
      })
      .from(equipment)
      .leftJoin(purchaseInfo, eq(purchaseInfo.equipmentId, equipment.id));

    return equipments;
  }

  async findMine(userId: number): Promise<EquipmentRow[]> {
    const [currentUser] = await this.drizzle.db
      .select({ employeeId: users.employeeId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser) {
      return [];
    }

    return this.drizzle.db
      .select({
        id: equipment.id,
        name: equipment.name,
        category: equipment.category,
        brand: equipment.brand,
        model: equipment.model,
        assetTag: equipment.assetTag,
        assignedTo: equipment.assignedTo,
        status: purchaseInfo.status,
        condition: purchaseInfo.condition,
      })
      .from(equipment)
      .leftJoin(purchaseInfo, eq(purchaseInfo.equipmentId, equipment.id))
      .where(eq(equipment.assignedTo, currentUser.employeeId));
  }

  async findOne(id: number) {
    const result = await this.drizzle.db
      .select({
        equipment: {
          id: equipment.id,
          name: equipment.name,
          category: equipment.category,
          brand: equipment.brand,
          model: equipment.model,
          serialNumber: equipment.serialNumber,
          assetTag: equipment.assetTag,
          description: equipment.description,
          location: equipment.location,
          notes: equipment.notes,
          assignmentDate: equipment.assignmentDate,
          returnDueDate: equipment.returnDueDate,
          createdAt: equipment.createdAt,
          updatedAt: equipment.updatedAt,
        },
        purchaseInfo: {
          purchaseDate: purchaseInfo.purchaseDate,
          purchaseCost: purchaseInfo.purchaseCost,
          supplier: purchaseInfo.supplier,
          warrantyExpiration: purchaseInfo.warrantyExpiration,
          condition: purchaseInfo.condition,
          status: purchaseInfo.status,
        },
        assignedTo: {
          id: employee.id,
          name: sql<string>`${employee.firstName} || ' ' || ${employee.lastName}`,
          email: employee.email,
        },
      })
      .from(equipment)
      .leftJoin(purchaseInfo, eq(purchaseInfo.equipmentId, equipment.id))
      .leftJoin(employee, eq(equipment.assignedTo, employee.id))
      .where(eq(equipment.id, id))
      .limit(1);

    if (!result[0]) return null;

    return {
      ...result[0].equipment,
      purchaseInfo: result[0].purchaseInfo,
      assignedTo: result[0].assignedTo?.id ? result[0].assignedTo : null,
    };
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    const { assignedTo } = updateEquipmentDto;

    return await this.drizzle.db.transaction(async (tx) => {
      // Update equipment record
      const [updatedEquipment] = await tx
        .update(equipment)
        .set({
          assignedTo:
            assignedTo !== undefined
              ? assignedTo === 0
                ? null
                : assignedTo
              : undefined,
          assignmentDate:
            assignedTo !== undefined
              ? assignedTo === 0
                ? null
                : new Date()
              : undefined,
          updatedAt: new Date(),
        })
        .where(eq(equipment.id, id))
        .returning();

      // Update purchase status if assignedTo changed
      if (assignedTo !== undefined) {
        await tx
          .update(purchaseInfo)
          .set({
            status:
              assignedTo === 0 || assignedTo === null
                ? 'Available'
                : 'Assigned',
          })
          .where(eq(purchaseInfo.equipmentId, id));
      }

      return updatedEquipment;
    });
  }

  remove(id: number) {
    return `This action removes a #${id} equipment`;
  }
}
