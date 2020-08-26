import { BaseEntity } from "typeorm";
import { ObjectType } from "typeorm/common/ObjectType";
export class CustomEntity extends BaseEntity {
  static async findOrCreate<T extends BaseEntity>(
    this: ObjectType<T>,
    data
  ): Promise<T | undefined> {
    const entity = this as any;
    let record = await entity.getRepository().findOne({ where: data });
    if (record) return record;
    record = await entity.create(data);
    return record.save();
  }
}
