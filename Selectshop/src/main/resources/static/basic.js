let targetId;

$(document).ready(function () {
    $('#query').on('keypress', function (e) {
        if (e.key == 'Enter') {
            execSearch();
        }
    });
    $('#close').on('click', function () {
        $('#container').removeClass('active');
    })

    $('.nav div.nav-see').on('click', function () {
        $('div.nav-see').addClass('active');
        $('div.nav-search').removeClass('active');

        $('#see-area').show();
        $('#search-area').hide();
    })
    $('.nav div.nav-search').on('click', function () {
        $('div.nav-see').removeClass('active');
        $('div.nav-search').addClass('active');

        $('#see-area').hide();
        $('#search-area').show();
    })

    $('#see-area').show();
    $('#search-area').hide();

    showProduct();
})


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function execSearch() {
    $('#search-result-box').empty();
    // 1. 검색창의 입력값을 가져온다.
    let query = $('#query').val();
    // 2. 검색창 입력값을 검사하고, 입력하지 않았을 경우 focus.
    if(query == ''){
        alert("검색어를 입력해주세요.");
        $('#query').focus();
    }
    // 3. GET /api/search?query=${query} 요청
    // 4. for 문마다 itemDto를 꺼내서 HTML 만들고 검색결과 목록에 붙이기!
    $.ajax({
        type : "GET",
        url : `/api/search?query=${query}`,
        success : function (response){
            for(let i=0; i<response.length; i++){
                let itemDto = response[i];
                let tempHtml = addHTML(itemDto);
                $('#search-result-box').append(tempHtml);
            }
        }
    })

}

function addHTML(itemDto) {
    return `<div class="search-itemDto">
            <div class="search-itemDto-left">
                <img src="${itemDto.image}" alt="">
            </div>
            <div class="search-itemDto-center">
                <div>${itemDto.title}</div>
                <div class="price">
                    ${numberWithCommas(itemDto.lprice)}
                    <span class="unit">원</span>
                </div>
            </div>
            <div class="search-itemDto-right">
                <img src="images/icon-save.png" alt="" onclick='addProduct(${JSON.stringify(itemDto)})'>
            </div>
        </div>`
}

function addProduct(itemDto) {
    // 1. POST /api/products 에 관심 상품 생성 요청
    $.ajax({
        type : "POST",
        url : "/api/products",
        data : JSON.stringify(itemDto),
        contentType : "application/json",
        success : function(response){
            $('#container').addClass('active')
            targetId = response.id;
        }
    })
}

function showProduct() {
    // 1. GET /api/products 요청
    $.ajax({
        type : "GET",
        url : "/api/products",
        success : function(response){
            // 2. 관심상품 목록, 검색결과 목록 비우기
            $('#product-container').empty();
            $('#search-result-box').empty();

            // 3. for 문마다 관심 상품 HTML 만들어서 관심상품 목록에 붙이기
            for(let i=0; i<response.length; i++){
                let product = response[i];
                let tempHtml = addProductItem(product);
                $('#product-container').append(tempHtml);
            }
        }
    })
}

function addProductItem(product) {
    return `<div class="product-card">
            <div class="card-header">
                <img src="${product.image}"
                     alt="" onclick="window.open('${product.link}')">
            </div>
            <div class="card-body">
                <div class="title">
                    ${product.title}
                </div>
                <div class="lprice">
                    <span>${numberWithCommas(product.lprice)}</span>원
                </div>
                <div class="isgood ${product.lprice <= product.myprice ? '' : 'none'}">
                    최저가
                </div>
            </div>
            <div class="card-footer">
                <button id="delete_btn" type="button" onclick="deleteOne(${product.id})">삭제</button>
            </div>
        </div>`;
}

// 관심 상품 삭제
function deleteOne(id){
    $.ajax({
        type : "DELETE",
        url : `/api/products/${id}`,
        success : function (){
            alert("삭제 완료.");
            window.location.reload();
        }
    })
}

// 관심 상품 최저가 등록
function setMyprice() {
     // 1. id가 myprice 인 input 태그에서 값을 가져온다.
    let myprice = $('#myprice').val();
     // 2. 만약 값을 입력하지 않았으면 alert를 띄우고 중단한다.
    if(myprice == ''){
        alert("값을 입력해주세요.");
        return;
    }
     // 3. PUT /api/product/${targetId} 에 data를 전달한다.
    $.ajax({
        type : "PUT",
        url : `/api/products/${targetId}`,
        data : JSON.stringify({'myprice' : myprice}),
        contentType : "application/json",
        success : function (){
            $('#container').removeClass('active');
            alert("등록 완료.");
            window.location.reload();
        }
    })
}