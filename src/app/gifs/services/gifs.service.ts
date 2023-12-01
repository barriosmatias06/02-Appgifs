import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifsList: Gif [] = [];

  private _tagsHistory:  string [] = [];
  private api_key:        string  = 'GyNyl055sRFsOOjmBdPDPo7HS4oEc32R';
  private serviceUrl:    string = 'https://api.giphy.com/v1/gifs';

  constructor(private http : HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
}


  get tagsHistory(){
    return [...this._tagsHistory]
  }

  private organizeHistory ( tag : string ) {
    tag = tag.toLowerCase();

    if(this.tagsHistory.includes( tag ) ) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !==tag)
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage (): void {
    localStorage.setItem('history',  JSON.stringify(this._tagsHistory) );
  }
  private loadLocalStorage():void{
    if( !localStorage.getItem('history')) return;

      this._tagsHistory = JSON.parse ( localStorage.getItem('history')! );

    if ( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0]);

  }


  public searchTag(tag:string):void{
    if ( tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.api_key)
    .set('limit', 10 )
    .set('q', tag)


    this.http.get <SearchResponse> (` ${ this.serviceUrl }/search`, {params} )
    .subscribe( resp => {
      // console.log(resp.data);

      this.gifsList = resp.data;

    })


  }

}
