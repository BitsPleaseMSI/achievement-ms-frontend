import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Achievement{
  eventName: string;
  name: string;
  participated: boolean;
  rollno: number;
  description: string;
  _id: string;
  year: number;
  department: string;
  date: string;
  rating: number;
  category: string;
  imageUrl: string;
  approved: boolean;
  venue: string;
}

export interface Posts{
    userId: number;
    id: number;
    title: string;
    body: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private client: HttpClient) { }

  posts(){
    //return this.client.post('http://127.0.0.1:8090/achievements/add')
    return this.client.get<Posts>('https://jsonplaceholder.typicode.com/posts')
  }

  addAchievement(){
    return this.client.get('http://127.0.0.1:8090/')
  }

  getAchievements(){
    return this.client.get<Achievement>('http://127.0.0.1:8090/achievements/all?department=Education')
  }
}
