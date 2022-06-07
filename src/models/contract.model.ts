import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Job } from "./job.model";
import { Profile } from "./profile.model";
import {CONTRACT_STATUS} from './status';
@Table({
    tableName: 'Contracts'
})
export class Contract extends Model {
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    terms!: string;

    @Column({
        type: DataType.ENUM({ values: Object.keys(CONTRACT_STATUS) })
    })
    status!: CONTRACT_STATUS;

    @ForeignKey(()=> Profile)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    ClientId!: number;
    
    @ForeignKey(()=> Profile)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    ContractorId!: number;

    @BelongsTo( ()=> Profile)
    profile: Profile;

    @HasMany(() => Job)
    jobs: Job[];
}