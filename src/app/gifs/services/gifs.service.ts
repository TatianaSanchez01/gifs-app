import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey: string = 'DPaPAH4jqHoNvP9knxf4DbRycYDhbzs3';
  private apiUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor(private httpClient: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs service ready');
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizedHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.httpClient
      .get<SearchResponse>(`${this.apiUrl}/search`, { params })
      .subscribe((res) => {
        this.gifList = res.data;
      });

    // fetch(`${this.apiUrl}?api_key=${this.apiKey}&q=valorant&limit=10`)
    //   .then((res) => res.json())
    //   .then((data) => console.log(data.data));
  }

  private organizedHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }
}
