module.exports = function solveSudoku(matrix) {


  let maybe = {};
  let usedLastKey = [];
  let restore =[];
  for(let i=0;i<9;i++){
    restore[i]=[];
  }
  let maybeRestore ={};
  let falsecount = 0;

  function mayInLine(line,column){
    let stack = [];
    for(let i=0;i<9;i++){
      if(stack.indexOf(matrix[i][column])==-1 && matrix[i][column]!=0){
        stack.push(matrix[i][column]);
      }
      if(stack.indexOf(matrix[line][i])==-1 && matrix[line][i]!=0){
        stack.push(matrix[line][i]);
      }
    }
    for (i=1;i<10;i++){
      if(stack.indexOf(i)==-1){
        maybe[line+'-'+column].push(i);
      }
    }
  }

  function copyMatrix(copy,paste){
    for(let i=0;i<copy.length;i++){
      for(let j=0;j<copy[i].length;j++){
        paste[i][j]=copy[i][j];
      }
    }
  }

  function copyObject(copy,paste){
    paste={};
    for(let key in copy){
      paste[key]=copy[key];
    }
    return paste;
  }

  function cubeCheck(line,column){
    let cube,i,j;
      switch (line){
        case 0:
        case 1:
        case 2:
          cube=[0,1,2];
          break;
        case 3:
        case 4:
        case 5:
          cube=[3,4,5];
          break;
        case 6:
        case 7:
        case 8:
          cube=[6,7,8];
          break;
      }

      switch (column){

        case 0:
        case 1:
        case 2:
          cube=cube[0];
          break;
        case 3:
        case 4:
        case 5:
          cube=cube[1];
          break;
        case 6:
        case 7:
        case 8:
          cube=cube[2];
          break;

      }

      switch (cube){
        case 0:
        case 1:
        case 2:
          i=0;
          break;
        case 3:
        case 4:
        case 5:
          i=3;
          break;
        case 6:
        case 7:
        case 8:
          i=6;
          break;
      }

      switch(cube){
        case 0:
        case 3:
        case 6:
          j=0;
          break;
        case 1:
        case 4:
        case 7:
          j=3;
          break;
        case 2:
        case 5:
        case 8:
          j=6;
          break;

      }

      return [i,j];
  }

  function exceptCube(line,column){
    let fic = cubeCheck(line,column);   //fic = first in cube
    let position;
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        position=maybe[line+'-'+column].indexOf(matrix[fic[0]+i][fic[1]+j]);
        if(position!=-1){
          maybe[line+'-'+column].splice(position,1);
        }
      }
    }

  }

  maybe.check = function(i,j){
    if(this[i+'-'+j].length==1){
      matrix[i][j]=this[i+'-'+j][0];
      delete this[i+'-'+j];
      maybe.changes++;
    }

  };

  function isNinjas(keys){    //check numbers, that available only in this cell in line, column, cube. Ninja because they hide :)
    let line=+keys.split('-')[0];
    let column=+keys.split('-')[1];
    let perhaps=[];

    for(let i=0;i<9;i++){
      if(!maybe[line + '-' + i] || line + '-' + i==keys) continue;
      for(let j=0;j<maybe[line + '-' + i].length;j++)
      if(perhaps.indexOf(maybe[line + '-' + i][j])==-1){
        perhaps.push(maybe[line + '-' + i][j]);
      }
    }


    for(let i=0;i<maybe[keys].length;i++){
        if(perhaps.indexOf(maybe[keys][i])==-1){
          matrix[line][column]=maybe[keys][i];
          delete maybe[keys];
          maybe.changes='ninja';
          return;
        }
      
    }

    perhaps=[];

    for(let i=0;i<9;i++){
      if(!maybe[i + '-' + column] || i + '-' + column==keys) continue;
      for(let j=0;j<maybe[i + '-' + column].length;j++)
      if(perhaps.indexOf(maybe[i + '-' + column][j])==-1){
        perhaps.push(maybe[i + '-' + column][j]);
      }
    }

    for(let i=0;i<maybe[keys].length;i++){
      if(perhaps.indexOf(maybe[keys][i])==-1){
        matrix[line][column]=maybe[keys][i];
        delete maybe[keys];
        maybe.changes='ninja';
        return;
      }
    
  }

  perhaps=[];
  let first = cubeCheck(line,column);

  for(i=0;i<3;i++){
    for(j=0;j<3;j++){
      if(!maybe[(first[0]+i) + '-' + (first[1]+j)] || (first[0]+i) + '-' + (first[1]+j)==keys) continue;
      for(let k=0;k<maybe[(first[0]+i) + '-' + (first[1]+j)].length;k++)
      if(perhaps.indexOf(maybe[(first[0]+i) + '-' + (first[1]+j)][k])==-1){
        perhaps.push(maybe[(first[0]+i) + '-' + (first[1]+j)][k]);
      }
    }
  }


  for(let i=0;i<maybe[keys].length;i++){
    if(perhaps.indexOf(maybe[keys][i])==-1){
      matrix[line][column]=maybe[keys][i];
      delete maybe[keys];
      maybe.changes='ninja';
      return;
    }
  
}

  }

  function addToMatrix(line,column,number){
    matrix[line][column]=number;
    delete maybe[line + '' + column];
    for(let i=0;i<9;i++){
      if(!maybe[line + '-' + i]) continue;
      if(maybe[line + '-' + i].indexOf(number)==-1){
        maybe[line + '-' + i].split(maybe[line + '-' + i].indexOf(number),1);
      }
    }

  } 

  function tryGuess(val,lastkey){
    if(usedLastKey.indexOf(lastkey)==-1){
      usedLastKey.push(lastkey);
    }
    if(lastkey){
      let line=+lastkey.split('-')[0];
      let column=+lastkey.split('-')[1];
      matrix[line][column]=maybe[lastkey][val];
    }
    for (let key in maybe){
      if(maybe[key].length==2 && key!='check' && key!='changes' && usedLastKey.indexOf(key)==-1){
        let line=+key.split('-')[0];
        let column=+key.split('-')[1];
        matrix[line][column]=maybe[key][val];
        return key;
      }
    }
  }

function solution(){
  falsecount=0;
do{
  maybe.changes=0;
  for(let key in maybe){
    if(key!='changes' && key!='check'){
      delete maybe[key];
    }
  }
  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      if(matrix[i][j]==0){
        maybe[i+'-'+j]=[];
        mayInLine(i,j);
        exceptCube(i,j);
        maybe.check(i,j);
      }
    }
  }

  if(maybe.changes==0){
  for(let key in maybe){
    if (key=='check' || key=='changes' || maybe.changes=='ninja') continue;
    isNinjas(key);
  }}

  if(maybe.changes==0){
    falsecount++;
  }
}while(falsecount<6 && Object.keys(maybe).length!=2);
}


solution();


let newfalsecount=0;


do{
  let lastkey=0;
  if(Object.keys(maybe).length==2) break;
  val=0;
  maybeRestore=copyObject(maybe,maybeRestore);
  copyMatrix(matrix,restore);
  lastkey=tryGuess(val);
  solution();

  if(Object.keys(maybe).length>2){
    val++;
    maybe=copyObject(maybeRestore,maybe);
    copyMatrix(restore,matrix);
    tryGuess(val,lastkey);
    solution();
  }
  if(Object.keys(maybe).length>2){
    copyMatrix(restore,matrix);
    maybe=copyObject(maybeRestore,maybe);
    newfalsecount++;
  }
  
}while(Object.keys(maybe).length>2 && newfalsecount<Object.keys(maybeRestore).length);


  return matrix;
  
}
