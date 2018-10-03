export function safe(str: string): boolean{

    console.log("sanitising " + str)

    if(
      str.includes('%3F') ||
      str.includes('%3C') ||
      str.includes('%3E')
    ) {
      console.log("DANGER logged on server: " + str)
      window.alert("Make sure you are not using any special characters\nother than [ @ ]  and [ . ]")
      return false;
    }

    console.log("its ok")
    return true;
}