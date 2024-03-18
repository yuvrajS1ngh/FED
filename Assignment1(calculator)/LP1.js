//SORT MENU TO JAIN MENU

let menu = ['chole rice','kadhai paneer','rajma rice','garlic bread','kadahi chicken','potato','chicken tandoori','fish fry','idli','dosa','kadhai chaap','momos','onion'];
let JainMenu = menu.filter((item) => 
{
  if(item.indexOf('chicken')!==-1 ||
  item.indexOf('fish')!==-1 ||
  item.indexOf('onion')!==-1 ||
  item.indexOf('potato')!==-1 ||
  item.indexOf('garlic bread')!==-1)
  {
    return false;
  }
      else
      {
        return true;
      }
    }
)
console.log(JainMenu)
