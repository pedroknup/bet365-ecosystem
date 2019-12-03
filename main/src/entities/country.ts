import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user} from "./user";


@Entity("country" ,{schema:"bet365" } )
export class country {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"name"
        })
    name:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:6,
        name:"abr"
        })
    abr:string;
        

   
    @OneToMany(()=>user, (user: user)=>user.country,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    users:user[];
    
}
