import { Injectable } from '@nestjs/common';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentForm, EquipmentRow } from '@repo/types';
import { DrizzleService } from 'src/database/drizzle.provider';
import { equipment, purchaseInfo } from 'src/database/schema';
import { eq } from 'drizzle-orm';

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

  findOne(id: number) {
    return `This action returns a #${id} equipment`;
  }

  update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    return `This action updates a #${id} equipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipment`;
  }
}
