document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('item-form');
    const itemInput = document.getElementById('item-input');
    const itemList = document.getElementById('item-list');
    const clearBtn = document.getElementById('clear');
    const itemFilter = document.getElementById('filter');
    let items = [];
    let isEditMode = false;
  
    loadItems();
  
    itemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newItem = itemInput.value.trim();
  
      if (newItem === '') {
        alert('Please add an item');
        return;
      }
  
      if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent.trim());
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
      } else {
        if (items.includes(newItem)) {
          alert('That item already exists!');
          return;
        }
      }
  
      addItemToDOM(newItem);
      addItemToStorage(newItem);
      itemInput.value = '';
      checkUI();
    });
  
    itemList.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const itemText = e.target.parentElement.textContent.trim();
        items = items.filter((item) => item !== itemText);
        removeItemFromStorage(itemText);
        e.target.parentElement.remove();
        checkUI();
      } else {
        setItemToEdit(e.target);
      }
    });
  
    clearBtn.addEventListener('click', () => {
      items = [];
      saveItems();
      itemList.innerHTML = '';
      checkUI();
    });
  
    itemFilter.addEventListener('input', (e) => {
      const text = e.target.value.toLowerCase();
      const itemListArray = Array.from(itemList.children);
  
      itemListArray.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.includes(text)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  
    function loadItems() {
      const storedItems = localStorage.getItem('items');
      items = storedItems ? JSON.parse(storedItems) : [];
      items.forEach(addItemToDOM);
      checkUI();
    }
  
    function saveItems() {
      localStorage.setItem('items', JSON.stringify(items));
    }
  
    function addItemToDOM(item) {
      const li = document.createElement('li');
      li.textContent = item;
      const removeBtn = createButton('remove-item btn-link text-red');
      li.appendChild(removeBtn);
      itemList.appendChild(li);
    }
  
    function createButton(classes) {
      const button = document.createElement('button');
      button.className = classes;
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-xmark';
      button.appendChild(icon);
      return button;
    }
  
    function addItemToStorage(item) {
      items.push(item);
      saveItems();
    }
  
    function removeItemFromStorage(item) {
      items = items.filter((i) => i !== item);
      saveItems();
    }
  
    function setItemToEdit(item) {
      isEditMode = true;
      itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
      item.classList.add('edit-mode');
      itemInput.value = item.textContent.trim();
      itemInput.focus();
    }
  
    function checkUI() {
      itemInput.value = '';
  
      const items = itemList.querySelectorAll('li');
  
      if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
      } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
      }
  
      isEditMode = false;
    }
});
  