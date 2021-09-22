import _ from "lodash";
import './style.styl'

let sus = (a,b) => {
  console.log(a*b);

}

function component() {
  const element = document.createElement('div');

  // Lodash imported
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('abober');
  sus(3,5);
  
  
  return element;
}

document.body.appendChild(component());