function apiGetBooks(title, succes, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://openlibrary.org/search.json?title=' + title);
    xhr.onreadystatechange = function() {        
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (succes) succes(data);
        } else {
            if (error) error(data);
        }
    };
    xhr.send();
}

function initDropdown(options) {
    var $input = options.inputElement;
    var $dropdownList = options.dropdownElement;
    var delay;

    function clearDropdownList() {
        $dropdownList.innerHTML = '';
    }
    
    function createDropdownItem(text) {
        let item = document.createElement('li');
        item.classList.add('autocomplete-dropdown__item');
        if (text.length > 55) {
            item.innerText = text.substr(0, 55) + '...';
        } else {
            item.innerText = text;
        }
        $dropdownList.append(item);
    }
    
    function closeDropdown() {
        $input.classList.remove('searchbox-input--active');
        clearDropdownList();
    }
    
    function activeLoader() {
        var $loader = document.querySelector('#loader');
        $loader.classList.add('loader--active');
    }
    
    function removeLoader() {
        var $loader = document.querySelector('#loader');
        $loader.classList.remove('loader--active');
    }
    
    $input.addEventListener('input', function() {
        activeLoader();
        $input.classList.add('searchbox-input--active');
        clearDropdownList();
        clearTimeout(delay);
        var title = $input.value.replace(/ /g, '+');
    
        delay = setTimeout(function() {
            apiGetBooks(title, function(data) {
                if (data.num_found === 0) {
                    removeLoader();
                    clearDropdownList();
                    createDropdownItem('Ничего не найдено');
                } else {
                    data.docs.forEach(element => {
                    removeLoader();
                    createDropdownItem(element.title_suggest);
                    })   
                }
            });
        }, 1000); 
    })
    
    $dropdownList.addEventListener('click', function(e) {
        if (e.target.classList.contains('autocomplete-dropdown__item')) {
            $input.value = e.target.innerText;
            closeDropdown();
        }
    })
    
    document.body.addEventListener('click', closeDropdown);

}

initDropdown({
    inputElement: document.querySelector('.searchbox-input'),
    dropdownElement: document.querySelector('.autocomplete-dropdown__list')
});
