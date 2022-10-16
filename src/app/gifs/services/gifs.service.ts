import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string ='4bwyFpIqLbJnZp156XR5xf2O6qu6Uswx';
  private _historial:string[]=[];
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'

  //TODO:Cambiar any por su tipo correspondiente.
  public resultados:Gif[]=[];

  get historial(){
    return [...this._historial];
  }


  constructor(private http:HttpClient){
    
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];


    // if(localStorage.getItem('historial') ){
    //   this._historial = JSON.parse(localStorage.getItem('historial')! ); // el ! significa confia en mi.xD
    // }
  }
    buscarGifs(query:string=''){
    query = query.trim().toLowerCase();
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

    localStorage.setItem('historial', JSON.stringify(this._historial)); // grabando en Local storage

    }

    const params = new HttpParams()
    .set('api_key',this.apiKey)
    .set('limit','10')
    .set('q',query);


    
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
    .subscribe((resp) => {
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados)); // grabando en Local storage

      
    })
}
}
