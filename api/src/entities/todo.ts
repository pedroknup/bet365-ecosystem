import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user} from "./user";


@Entity("todo" ,{schema:"pk-boilerplate" } )
@Index("todo-user-id_idx",["user",])
export class todo {

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
        nullable:true,
        length:45,
        name:"description"
        })
    description:string | null;
        

    @Column("binary",{ 
        nullable:false,
        default: () => "'0'",
        name:"isDone"
        })
    isDone:Buffer;
        

    @Column("datetime",{ 
        nullable:true,
        default: () => "CURRENT_TIMESTAMP",
        name:"createdAt"
        })
    createdAt:Date | null;
        

   
    @ManyToOne(()=>user, (user: user)=>user.todos,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'userId'})
    user:user | null;

}
