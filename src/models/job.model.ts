import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Contract } from "./contract.model";

@Table({
    tableName: 'Jobs'
})
export class Job extends Model {
    @ForeignKey(()=>Contract)
    @Column({
        type: DataType.INTEGER
    })
    ContractId: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    description!: string;

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false
    })
    price!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    paid!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    paymentDate!: number;

    @BelongsTo(() => Contract)
    contract: Contract;
}