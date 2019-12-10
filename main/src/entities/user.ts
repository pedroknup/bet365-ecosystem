import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user_status} from "./user_status";
import {role} from "./role";
import {country} from "./country";
import {ValidIp} from "./ValidIp";
import {bet} from "./bet";
import {forgot_password} from "./forgot_password";
import {user_external_login} from "./user_external_login";
import {user_log} from "./user_log";


@Entity("user" ,{schema:"bet365" } )
@Index("status-id_idx",["status",])
@Index("user-role-id_idx",["role",])
@Index("user-country-id_idx",["country",])
@Index("user-ip_idx",["ip",])
export class user {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"firstName"
        })
    firstName:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:96,
        name:"lastName"
        })
    lastName:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:96,
        name:"email"
        })
    email:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:196,
        name:"password"
        })
    password:string | null;
        

    @Column("datetime",{ 
        nullable:false,
        default: () => "CURRENT_TIMESTAMP",
        name:"createdAt"
        })
    createdAt:Date;
        

    @Column("varchar",{ 
        nullable:true,
        length:96,
        name:"profilePic"
        })
    profilePic:string | null;
        

   
    @ManyToOne(()=>user_status, (user_status: user_status)=>user_status.users,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'statusId'})
    status:user_status | null;


   
    @ManyToOne(()=>role, (role: role)=>role.users,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'roleId'})
    role:role | null;


   
    @ManyToOne(()=>country, (country: country)=>country.users,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'countryId'})
    country:country | null;


    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"betUsername"
        })
    betUsername:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"betPassword"
        })
    betPassword:string | null;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'1'",
        name:"simultaneousBet"
        })
    simultaneousBet:number;
        

    @Column("float",{ 
        nullable:false,
        default: () => "'0'",
        precision:12,
        name:"betValue"
        })
    betValue:number;
        

   
    @ManyToOne(()=>ValidIp, (ValidIp: ValidIp)=>ValidIp.users,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'ip'})
    ip:ValidIp | null;


    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"estrategy"
        })
    estrategy:number;
        

   
    @OneToMany(()=>bet, (bet: bet)=>bet.user,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    bets:bet[];
    

   
    @OneToMany(()=>forgot_password, (forgot_password: forgot_password)=>forgot_password.user,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    forgotPasswords:forgot_password[];
    

   
    @OneToMany(()=>user_external_login, (user_external_login: user_external_login)=>user_external_login.user,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    userExternalLogins:user_external_login[];
    

   
    @OneToMany(()=>user_log, (user_log: user_log)=>user_log.idUser,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    userLogs:user_log[];
    
}
