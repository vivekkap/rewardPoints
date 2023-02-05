import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemsService } from './shared/items.service';
import { Item } from './shared/item.model';
import { Items } from './shared/items.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'rewardCalculator';
  private _jsonURL = 'assets/db.json';
  customerData: {} = {'items': ''};
  list:Items[] = [];
  oneMonthRewards: number = 0;
  monthList:any= [];
  rewardsArray: any = []; 
  totalRewardsPerMonth: any = [];
  totalRewardsAllMonths:number;
  monthNames = ["January", "February", "March","April", "May", "June",
    "July", "August", "September","October", "November", "December"];

  constructor(private itemsService: ItemsService,private http: HttpClient) 
  {

  }
  

  ngOnInit() {
    
    this.getItems();
   
    setTimeout(() => {
      this.list.forEach((custData, index, array) => {
        var date = custData.date;
        if (date) {
          if(this.monthList.indexOf(new Date(date)?.getMonth()+1) === -1) {
            this.monthList.push(new Date(date)?.getMonth()+1);
          }
          let timestamp = new Date(date)?.getTime();
          array[index]['timeStamp'] = timestamp;
        }
      });
      this.list = this.getLastThreeMonthsList();
      this.rewardPerMonth(this.list);
      this.totalRewardsPerMonth = this.getTotalRewardsPerMonth();
      this.sumAllRewards();
    },200);
  }


  getLastThreeMonthsList() {
      var d = new Date();
      var lastthreeMonthDate = d.setMonth(d.getMonth() - 3);
      return this.list.filter(trans => trans.timeStamp?trans.timeStamp > lastthreeMonthDate: trans.timeStamp);
      
  }

  rewardPerMonth(lastThreeMonthsList:any) {
    for(let i=0; i<this.monthList.length; i++) {
      let filteredList = this.list.filter(trans => trans.date?new Date(trans.date).getMonth()+1 == this.monthList[i]: trans);
      if(filteredList.length>0) {
        for(let j=0; j<filteredList.length; j++) {
          this.rewardsArray.push({'month': this.monthList[i], 'value': this.calculateRewards(filteredList[j].amount)}) 
        }  
      }
    }
    
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  getItems() {
      this.itemsService.getall()
        .subscribe((response:Item) => {
        this.list = response['items'];
      });
  }

  calculateRewards(price:any) {
    if (price >=50 && price < 100) {
        return price-50;
    } else if (price >100){
        return (2*(price-100) + 50);
    }
    return 0;
  }

  getTotalRewardsPerMonth() {
    const res = [];
    let arr = this.rewardsArray;
    for(let i = 0; i < arr.length; i++){
       const ind = res.findIndex(el => el.month === arr[i].month);
       if(ind === -1){
          res.push(arr[i]);
       }else{
          res[ind].value += arr[i].value;
       };
    };
    return res;
  }

  sumAllRewards() {
    this.totalRewardsAllMonths = this.totalRewardsPerMonth.map(a => a.value).reduce(function(a, b)
    {
      return a + b;
    });
  }

}
