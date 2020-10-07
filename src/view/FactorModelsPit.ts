import { ViewEntity, ViewColumn } from "typeorm";
@ViewEntity({
  expression: `
    SELECT mmp.location,
      mmp.pit,
      mmp.to_date,
      mmp.id_model,
      mmp.model,
      mmp.id_metric,
      mmp.metric,
      f.id AS id_factor,
      f.name AS factor,
      mmp.value AS model_value
      FROM (monthly_model_pit mmp
      LEFT JOIN factor f ON (((mmp.id_model = f.classification1_id) OR (mmp.id_model = f.classification2_id))))
    WHERE (f.name IS NOT NULL);
  `,

})
export class FactorModelsPit {

  @ViewColumn()
  location: number;

  @ViewColumn()
  pit: string;

  @ViewColumn()
  to_date: Date;

  @ViewColumn()
  id_model: number;

  @ViewColumn()
  model: string;

  @ViewColumn()
  id_metric: string;

  @ViewColumn()
  metric: string;

  @ViewColumn()
  id_factor: number;

  @ViewColumn()
  factor: string;

  @ViewColumn()
  model_value: number;

}