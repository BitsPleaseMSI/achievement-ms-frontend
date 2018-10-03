export class Achievement{
  constructor(
    public rollNo: string,
    public department: string,
    public year: number,
    public date: string,
    public venue: string,
    public category: string,
    public participated: boolean,
    public description: string,
    public eventName: string,
    public name: string,
    public title: string,
    public semester: number,
    public shift: string,
    public section: string,
    public sessionFrom: number,
    public sessionTo: number
  ){ }
}
