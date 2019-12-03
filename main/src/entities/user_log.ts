import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user} from "./user";


@Entity("user_log" ,{schema:"bet365" } )
@Index("log-user-id_idx",["idUser",])
export class user_log {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:150,
        name:"text"
        })
    text:string;
        

   
    @ManyToOne(()=>user, (user: user)=>user.userLogs,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'idUser'})
    idUser:user | null;

}
