import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {match} from "./match";
import {user} from "./user";


@Entity("bet" ,{schema:"bet365" } )
@Index("todo-user-id_idx",["user",])
@Index("bet-match-id_idx",["match",])
export class bet {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>match, (match: match)=>match.bets,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'matchId'})
    match:match | null;


    @Column("float",{ 
        nullable:false,
        default: () => "'0'",
        precision:12,
        name:"value"
        })
    value:number;
        

    @Column("datetime",{ 
        nullable:true,
        default: () => "CURRENT_TIMESTAMP",
        name:"createdAt"
        })
    createdAt:Date | null;
        

   
    @ManyToOne(()=>user, (user: user)=>user.bets,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'userId'})
    user:user | null;


    @Column("float",{ 
        nullable:true,
        default: () => "'0'",
        precision:12,
        name:"odds"
        })
    odds:number | null;
        
}
