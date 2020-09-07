export const TRIGGER_LOGIC_UP: string = `
    if (typeof migrationStructure.up === "string") {
      await queryRunner.query(migrationStructure.up);
    }
`;

export const FUNCTION_LOGIC_UP: string = `
    if (typeof migrationStructure.up !== "string") {
      await queryRunner.query(migrationStructure.up.create);
      await queryRunner.query(migrationStructure.up.afterCreated);
    } 
`;

export const STRUCTURE_DOWN: string = `
    await queryRunner.query(migrationStructure.down);
`;