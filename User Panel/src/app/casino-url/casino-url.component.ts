import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { user_socket } from 'app/app.module';  // Updated to absolute path
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UsersService } from '../services/users.service';
import { Router} from "@angular/router";

const casino_operatorId= environment['casino_operatorId'];

@Component({
  selector: 'app-casino-url',
  templateUrl: './casino-url.component.html',
  styleUrls: ['./casino-url.component.scss']
})
export class CasinoUrlComponent implements OnInit,OnDestroy {
  gameId:any;
  loader:boolean=false;
  userDetails:any;
  iframUrl:any;
  amountId:any;
  depWith:any;
  casinoBal:any=0;
  walletBalance:any=0;
  amount:string='';
  casino:any;
  deviceInfo:any;
  allBetData: any;
  allBetDataLength:any=0;

  constructor(private socket: user_socket,public sanitizer :DomSanitizer,public httpClient:UsersService,private toastr: ToastrService,public router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.userDetails=JSON.parse(sessionStorage.getItem('userDetails'));
    this.casino=JSON.parse(sessionStorage.getItem('casinoDb'));
     // checkDevice
     this.deviceInfo=JSON.parse(sessionStorage.getItem('is_desktop')); 
      
     if(this.deviceInfo){
       this.getMyBets();
     }
   if(this.casino.gameId===''|| !this.casino.gameId)
   {
     // static_image_first(Aura_casino)
     this.getAuraCasino();
   }else{
     // dynamic_image(Qtech Game)
     this.getUrl();
   }
   
   }

  ngOnInit(): void {
     
   
  }

  async getDetials()
  {
    try {
      const data=await JSON.parse(sessionStorage.getItem('userDetails'));
      return data;
    } catch (e) {
      return null;
    }
    
  }
  
   getUrl()
  {
    this.getUserBalance();
   
    const userdata = {
      gameId:this.casino.gameId,
      tableId:this.casino.tableId
    };

    this.httpClient.Post('singleGame',userdata).subscribe((res:any) => { 
      
      if (res.success) {
        let url= res.data.url;
        this.iframUrl=this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } 
      else
      {
        this.toastr.error(res.message, '', {
          timeOut: 10000,
        });
      }
    });
   
  }

  getAuraCasino()
  {
    if(this.deviceInfo)
    {
      this.iframUrl=this.sanitizer.bypassSecurityTrustResourceUrl('https://d2.fawk.app/#/splash-screen/'+this.userDetails.verifytoken+'/'+casino_operatorId
      +'?opentable='+this.casino.tableId);
    }else
    {
      this.iframUrl=this.sanitizer.bypassSecurityTrustResourceUrl('https://m2.fawk.app/#/splash-screen/'+this.userDetails.verifytoken+'/'+casino_operatorId
      +'?opentable='+this.casino.tableId);
    }
   
  }


  getUserBalance() {
    
    this.httpClient.Post("getUserDetails",null).subscribe((res:any)=>{

      if(res.success)
      {
        this.walletBalance = res.doc.balance;
        this.getCasinoBal();
      }
      else{
        console.warn(res.message);
      }
   });
     
   
    }

    getCasinoBal() {
      const userdata = {
        user: {
          _id: this.userDetails._id,
          key: this.userDetails.key,
          details: {
            username: this.userDetails.details.username,
            role: this.userDetails.details.role,
            status: this.userDetails.details.status,
          },
        }
      };
      this.socket.emit('get-userbalance', userdata);
      
      this.socket.on('get-balance-success',(function(data:any){
        
        if(data){
          this.casinoBal=data.amount;
        }
       }).bind(this));
      
    }

  action(id,value)
  {
    this.amountId=id;
    this.depWith=value;
  }

  onSubmit()
 { 
   if(this.amount=="")
   {
    this.toastr.error('amount is invalid', 'Error !');
   }
   else
   {
      this.loader=true;
      if(this.amountId=='1')
      {
       this.depositApi(this.amount);
      }
      else if(this.amountId=='2')
      {
       this.withdrawApi(this.amount);
      }
    
   }
 }

 withdrawApi(amount:string){
  this.httpClient.Get('casino-balance-withdrawapp/'+this.userDetails.details._id+ '/' +amount).subscribe((response:any) => {

    if(response.error){
      this.toastr.error(response.message, 'Error!');
      this.loader=false;
    }
    else
    {
     this.toastr.success(response.message, 'Success!');
     this.loader=false;
     this.refreshUsrBal();
     this.getCasinoBal();  
    }
  });

}

depositApi(amount:string)
{
  this.httpClient.Get('casino-balance-transferapp/'+ this.userDetails.details._id + '/' +amount).subscribe((response:any) => {

    if(response.error){
       this.toastr.error(response.message, 'Error!');
       this.loader=false;
    }
    else{
     this.toastr.success(response.message, 'Success!');
     this.loader=false;
     this.refreshUsrBal();
     this.getCasinoBal();
    }
  });
 
}

refreshUsrBal() {

  this.httpClient.Post("getUserDetails",null).subscribe((res:any)=>{

    if(res.success)
    {
      this.walletBalance = res.doc.balance;
      this.httpClient.updateUserBalanceSubject(res.doc);
    }
    else{
      console.warn(res.message);
    }
 });
  
  
}

getMyBets() {
  this.allBetData=[];
  const getBet = {
    token:this.userDetails.verifytoken,
    filter: {
      eventId: this.casino.tableId,
      username: this.userDetails.details.username,
      deleted: false,
      result: 'ACTIVE',
    },
    sort: {placedTime: -1},
  };
  
  this.socket.emit('get-bets', getBet);

  this.socket.on('get-bets-success', (function(data:any){ 
    
    if(data.length>0){
      if(data[0].eventId===this.casino.tableId)
      {
        this.allBetDataLength=0;
        this.allBetData=data; 
        this.allBetDataLength = this.allBetData.length;

      }

      //  this.socket.removeAllListeners('get-bets-success');
    }
    
   }).bind(this));

}

  ngOnDestroy() {
    // sessionStorage.removeItem('casinoDb');
    this.socket.removeAllListeners();
  }

}
