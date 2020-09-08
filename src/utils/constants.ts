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

export const LOGIC_DOWN: string = `
    await queryRunner.query(migrationStructure.down);
`;

export const EXTENSION_LOGIC_UP: string = `
  for (let extension of EXTENSIONS) {
    if (typeof extension.up !== "string") {
      await queryRunner.query(extension.up.create);
      await queryRunner.query(extension.up.afterCreated);
    }
  }
`;

export const EXTENSION_LOGIC_DOWN: string = `
  for (let extension of EXTENSIONS) {
    await queryRunner.query(extension.down);
  }
`;
