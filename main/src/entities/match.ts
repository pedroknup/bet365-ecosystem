import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {bet} from "./bet";


@Entity("match" ,{schema:"bet365" } )
export class match {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"teamA"
        })
    teamA:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"teamB"
        })
    teamB:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"date"
        })
    date:Date;
        

    @Column("datetime",{ 
        nullable:true,
        default: () => "CURRENT_TIMESTAMP",
        name:"createdAt"
        })
    createdAt:Date | null;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"scoreA"
        })
    scoreA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"scoreB"
        })
    scoreB:number;
        

    @Column("float",{ 
        nullable:false,
        default: () => "'0'",
        precision:12,
        name:"odds"
        })
    odds:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:95,
        name:"url"
        })
    url:string;
        

   
    @OneToMany(()=>bet, (bet: bet)=>bet.match,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    bets:bet[];
    
}
