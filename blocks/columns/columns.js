/*export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}*/

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {    
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  const section = document.getElementsByClassName('section columns-container');
  const html = section[0].innerHTML;
  section[0].setAttribute('class','section columns-container outer');
  const column = document.getElementsByClassName('columns-wrapper');
  for(let i = 0; i < column.length; i++) {
    if(column[i].children[0].classList.contains('columns-2-cols')){
    column[i].children[0].setAttribute('class','columns block columns-2-cols posts');
    const post = column[i].children[0].children[0];
    const firstDiv = post.querySelector('p')
    firstDiv.outerHTML = '<h2 class="title">'+firstDiv.innerHTML+'</h2>'
    const secondDiv = post.querySelector('div div div > p:first-child');
    secondDiv.outerHTML = '<h2 class="title">'+secondDiv.innerHTML+'</h2>'
      for(let j = 0; j < post.length; j++) {
        post[j].setAttribute('class','post');
      }
    column[i].setAttribute('class','col recent-posts');
    //console.log('col>'+col);*/
    }
  }
}
