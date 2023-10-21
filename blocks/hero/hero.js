export default function decorate() {
  const heroClass = document.getElementsByClassName('hero block');
  heroClass[0].children[0].setAttribute('class', 'outer');
  heroClass[0].children[0].children[0].setAttribute('class', 'vertical');
  const heroDiv = heroClass[0].children[0].children[0];
  const pTags = heroDiv.getElementsByTagName('p');
  let innerElements = '';
  for (let i = 0; i < pTags.length; i += 1) {
    if (pTags[i].outerHTML.includes('class')) {
      innerElements += pTags[i].innerHTML.replace('class="button"', 'style="background-color:#000;" class="hs-button" target="_blank"');
    } else if (i === 1) {
      const heroTitle = pTags[i].outerHTML.replace(/<p[ ]*>/g, '');
      innerElements += heroTitle.replace(/<\/p>/g, '<br>');
    } else if (i === 2) {
      const heroDescription = pTags[i].outerHTML.replace(/<p[ ]*>/g, '<span style="font-size: 70%;">');
      innerElements += heroDescription.replace(/<\/p>/g, '</span><br>');
    } else {
      const heroImage = pTags[i].outerHTML.replace(/<p[ ]*>/g, '');
      innerElements += heroImage.replace(/<\/p>/g, '<br>');
    }
  }
  heroDiv.innerHTML = `<h1>${innerElements}</h1>`;
}
