import { getMetadata } from '../../scripts/aem.js';

function createGcseTools() {
  const gcseTools = document.createElement('div');
  gcseTools.id = 'mmg-gcse-tools';
  const gcseOuter = document.createElement('div');
  gcseOuter.className = 'mmg-gcse-outer';
  const closeButton = document.createElement('span');
  closeButton.className = 'close-btn';
  closeButton.innerText = '×';

  // Add click event to close the search and remove the element from the DOM
  closeButton.addEventListener('click', () => {
    const searchResultsBlock = document.getElementById('mmg-gcse');
    if (searchResultsBlock) {
      searchResultsBlock.remove();
    }
  });

  gcseOuter.appendChild(closeButton);
  gcseTools.appendChild(gcseOuter);
  return gcseTools;
}

function createGcseBox() {
  const gcseBox = document.createElement('div');
  gcseBox.id = 'mmg-gcse-box';
  const outer = document.createElement('div');
  outer.className = 'mmg-gcse-outer';
  outer.style.opacity = 1;
  gcseBox.appendChild(outer);
  return gcseBox;
}

function createHeadingElement(input) {
  const heading = document.createElement('h2');
  heading.innerText = `Search for: ${input}`;
  heading.classList.add('search-title');
  return heading;
}

function createCountElement(resultsLength, total) {
  const count = document.createElement('p');
  count.className = 'search-info';
  count.innerText = `Results ${resultsLength} out of ${total} items`;
  return count;
}

function createResultLink(result) {
  const link = document.createElement('a');
  link.classList.add('item');

  const spanTitle = document.createElement('span');
  spanTitle.classList.add('title');
  spanTitle.textContent = result.title;

  link.appendChild(spanTitle);
  link.href = result.path;

  return link;
}

function createSearchResultsBlock(results, input, total) {
  // Create the main search results container
  const searchResultsBlock = document.createElement('div');
  searchResultsBlock.id = 'mmg-gcse';
  searchResultsBlock.className = 'active';
  const bodyHeight = document.body.clientHeight;
  const header = document.getElementById('header');
  const headerHeight = header.clientHeight;
  searchResultsBlock.style.height = `${bodyHeight - headerHeight}px`;

  // Create GCSE tools container
  const gcseTools = createGcseTools();

  // Create GCSE box container
  const gcseBox = createGcseBox();

  // Create heading element
  const heading = createHeadingElement(input);

  // Create count element
  const count = createCountElement(results.length, total);

  // Append elements to the searchResultsBlock
  const outer = gcseBox.querySelector('.mmg-gcse-outer');
  outer.appendChild(heading);
  outer.appendChild(count);

  // Create individual result elements
  results.forEach((result) => {
    const link = createResultLink(result);
    outer.appendChild(link);
  });

  searchResultsBlock.appendChild(gcseTools);
  searchResultsBlock.appendChild(gcseBox);

  return searchResultsBlock;
}

function addClassesToMenuItems(element, depth) {
  const childItems = element.children;
  for (let i = 0; i < childItems.length; i += 1) {
    const item = childItems[i];
    // Add class to the immediate child element
    item.classList.add('hs-menu-item', `hs-menu-depth-${depth}`);

    // Check if the href matches the current domain
    const link = item.querySelector('a');
    if (link && link.href === window.location.href) {
      item.classList.add('active');
    }
    const childElement = item.querySelector('ul');

    if (childElement?.children?.length > 0) {
      const nextDepth = depth + 1;
      addClassesToMenuItems(childElement, nextDepth);
    }
  }
}

function handleSearchFormSubmit(formElement) {
  function searchFormHandler(e) {
    e.preventDefault();
    const inputValue = formElement.querySelector('input').value;
    fetch('/query-index.json')
      .then((response) => response.json())
      .then((jsonData) => {
        // Perform a search based on the fetched JSON data
        const results = jsonData.data.filter((item) => {
          // Customize this condition to match your search criteria
          const it = item.title.toLowerCase().includes(inputValue);
          return it;
        });
        const resultBlock = document.querySelector('.search-results');
        if (resultBlock) {
          resultBlock.remove();
        }
        if (results.length > 0 && inputValue !== '') {
          // Create a block based on the search results
          const searchResultsBlock = createSearchResultsBlock(
            results,
            inputValue,
            jsonData.total,
          );
          document.body.appendChild(searchResultsBlock);
        }
      });
  }
  return searchFormHandler;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    const htmlElements = document.createElement('div');
    htmlElements.innerHTML = html;
    const childElements = htmlElements.querySelector('div');
    // decorate nav DOM
    const nav = document.createElement('header');
    nav.id = 'header';

    const outer = document.createElement('div');
    outer.classList.add('outer');
    // outer.innerHTML = html;
    nav.appendChild(outer);

    // convertToLogo(nav.children[0]);
    const logo = document.createElement('a');
    logo.id = 'logo';
    logo.href = '/';
    logo.innerHTML = childElements.children[0].innerHTML;
    outer.appendChild(logo);

    const headerNav = document.createElement('div');
    headerNav.id = 'header-nav';

    const mobileNav = document.createElement('div');
    mobileNav.id = 'mobile-nav';
    const spanTag = document.createElement('span');
    spanTag.classList.add('icon-menu');
    mobileNav.appendChild(spanTag);

    mobileNav.addEventListener('click', () => {
      headerNav.classList.toggle('hover');
    });

    const headerNavIn = document.createElement('div');
    headerNavIn.id = 'header-nav-in';

    const headerInfo = document.createElement('div');
    headerInfo.id = 'header-info';

    // Create a div element with id, class, and inline style
    const customSearchDiv = document.createElement('div');
    customSearchDiv.id = 'custom-search';
    customSearchDiv.className = '';
    customSearchDiv.style = '';

    // Create a form element and set the data-hs-cf-bound attribute
    const formElement = document.createElement('form');
    formElement.setAttribute('data-hs-cf-bound', 'true');
    formElement.setAttribute('data-gtm-form-interact-id', 0);

    // Create an input element with name, id, value, placeholder, and inline style
    const inputElement = document.createElement('input');
    inputElement.name = 'q';
    inputElement.id = 'customsearch-q';
    inputElement.value = '';
    inputElement.placeholder = 'Enter text...';
    inputElement.style.display = 'none';
    inputElement.setAttribute('data-gtm-form-interact-field-id', 0);

    // Create a span element with class
    const spanElement = document.createElement('span');
    spanElement.className = 'icon-search';

    // // Add event listener to input element
    spanElement.addEventListener('click', () => {
      customSearchDiv.classList.toggle('active');
      if (inputElement.style.display === 'none') {
        inputElement.style.display = 'inline-block';
      } else {
        inputElement.style.display = 'none';
      }
    });

    // Append the input element and span element to the form element
    formElement.appendChild(inputElement);
    formElement.appendChild(spanElement);

    // Append the form element to the custom search div
    customSearchDiv.appendChild(formElement);

    const clonedCustomSearchDiv = customSearchDiv.cloneNode(true);
    clonedCustomSearchDiv.classList.add('mobile-search');
    // Append the custom search div to the document body or any other parent element
    outer.appendChild(clonedCustomSearchDiv);
    customSearchDiv.classList.add('desktop-search');
    headerInfo.appendChild(customSearchDiv);

    const mobileSpan = clonedCustomSearchDiv.querySelector('span');
    const mobileInput = clonedCustomSearchDiv.querySelector('input');
    const mobileForm = clonedCustomSearchDiv.querySelector('form');

    mobileSpan.addEventListener('click', () => {
      clonedCustomSearchDiv.classList.toggle('active');
      if (mobileInput.style.display === 'none') {
        mobileInput.style.display = 'inline-block';
      } else {
        mobileInput.style.display = 'none';
      }
    });

    mobileForm.addEventListener('submit', handleSearchFormSubmit(mobileForm));
    formElement.addEventListener('submit', handleSearchFormSubmit(formElement));

    const listElements = document.createElement('div');

    listElements.innerHTML = childElements.children[1].innerHTML;

    const elements = listElements.querySelectorAll('li');
    elements.forEach((li) => {
      const anchor = li.querySelector('a');
      if (anchor) {
        // Get the first word of the anchor's inner text
        const firstWord = anchor.innerText.split(' ')[0].toLocaleLowerCase();
        // Set the first word as a class name
        anchor.classList.add(firstWord);
        // Append the modified anchor to headerInfo
        headerInfo.appendChild(anchor.cloneNode(true));
      }
    });
    // document.body.appendChild(headerInfo);
    const headerMenu = document.createElement('nav');
    headerMenu.id = 'menu';

    const menuWrapper = document.createElement('div');
    menuWrapper.id = 'hs_menu_wrapper_mainmenu';
    menuWrapper.classList.add(
      'hs-menu-wrapper',
      'active-branch',
      'no-flyouts',
      'hs-menu-flow-horizontal',
    );
    const menuList = childElements.children[2].innerHTML;

    // Create a temporary div element
    const tempDiv = document.createElement('ul');

    // Set the innerHTML of the temporary div
    tempDiv.innerHTML = menuList;

    // Find the ul element within the temporary div
    const menuListWrapper = tempDiv;

    // Append menuListWrapper to headerMenu
    menuWrapper.appendChild(menuListWrapper);
    headerMenu.appendChild(menuWrapper);

    // Add classes to menu items
    addClassesToMenuItems(menuListWrapper, 1);

    headerNavIn.appendChild(headerInfo);
    headerNavIn.appendChild(headerMenu);

    headerNav.appendChild(headerNavIn);
    headerNav.appendChild(mobileNav);
    outer.appendChild(headerNav);

    block.append(nav);
  }
}
