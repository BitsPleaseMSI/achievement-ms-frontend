export function safe(str: string): boolean{
    if(
      str.includes('<') ||
      str.includes('>') ||
      str.includes('%3F') ||
      str.includes('%3C') ||
      str.includes('%3E')
    ){
      window.alert("[ ? ], [ < ], [ > ] Are invalid inputs.")
      return false;
    }

    return true;
}
