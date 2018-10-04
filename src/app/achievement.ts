export class Achievement{
  constructor(
    public name: string,
    public rollNo: string,
    public section: string,
    public sessionFrom: number,
    public sessionTo: number,
    public semester: number,
    public department: string,
    public shift: string,
    public eventName: string,
    public year: number,
    public date: string,
    public title: string,
    public venue: string,
    public category: string,
    public participated: boolean,
    public description: string,
    public image: string,
  ){ }
}
