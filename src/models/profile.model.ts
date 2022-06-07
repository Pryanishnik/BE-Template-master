import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Contract } from "./contract.model";
import { PROFILE_TYPE } from "./profile_type";
@Table({
    tableName: 'Profiles'
})
export class Profile extends Model {
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    firstName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lastName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    profession!: string;

    @Column({
        type: DataType.DECIMAL(12,2),
        allowNull: false
    })
    balance!: number;

    @Column({
        type: DataType.ENUM({values: Object.keys(PROFILE_TYPE)}),
    })
    type!: PROFILE_TYPE;

    @HasMany(()=> Contract, 'ClientId')
    clientContracts: Contract[];

    @HasMany(()=> Contract, 'ContractorId')
    contractorContracts: Contract[];
}