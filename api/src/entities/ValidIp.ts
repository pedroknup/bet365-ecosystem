import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user} from "./user";


@Entity("ValidIp" ,{schema:"bet365" } )
export class ValidIp {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:20,
        name:"ip"
        })
    ip:string;
        

    @Column("tinyint",{ 
        nullable:false,
        default: () => "'1'",
        name:"isValid"
        })
    isValid:number;
        

   
    @OneToMany(()=>user, (user: user)=>user.ip,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    users:user[];
    
}
