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
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"possessionA"
        })
    possessionA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"possessionB"
        })
    possessionB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"attacksA"
        })
    attacksA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"attacksB"
        })
    attacksB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"dangerousAttackA"
        })
    dangerousAttackA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"dangerousAttackB"
        })
    dangerousAttackB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"cornerKickA"
        })
    cornerKickA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"cornerKickB"
        })
    cornerKickB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"redCardA"
        })
    redCardA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"redCardB"
        })
    redCardB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"yellowCardA"
        })
    yellowCardA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"yellowCardB"
        })
    yellowCardB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"onTargetA"
        })
    onTargetA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"onTargetB"
        })
    onTargetB:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"offTargetA"
        })
    offTargetA:number;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"offTargetB"
        })
    offTargetB:number;
        

    @Column("double",{ 
        nullable:true,
        precision:22,
        name:"lessThan"
        })
    lessThan:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"winner"
        })
    winner:number | null;
        

   
    @OneToMany(()=>bet, (bet: bet)=>bet.match,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    bets:bet[];
    
}
