const name = localStorage.getItem('name');
const id = localStorage.getItem('id');
const maxprice = localStorage.getItem('maxprice');
let modalCtrl = false;
const listProductApproved = [];
const listProductWait = [];

$().ready(() => {
    $('#modal-new-product').hide();

    Swal.fire(
        `Olá ${name}`,
        'Seja bem vindo!',
        'success'
    );

    getRequest();
    getProduct();

    $('#stock').mask('9999');
    $('#price').mask("###0,00", { reverse: true })
});

async function getRequest() {
    let listRequest = await $.get(`../backend/requestController.php?action=selectByProvider&id=${id}`);

    console.log(listRequest);
}

async function getProduct() {
    $('#product-approved-list').html('');
    $('#product-wait-list').html('');

    let listProduct = JSON.parse(
        await $.get(`../backend/productController.php?action=selectByProvider&id=${id}`)
    );

    let htmlAproved = '';
    let htmlWait = '';
    if (listProduct.length > 0) {
        listProduct.forEach(el => {
            const tmp = `
            <div class="left-content box-card">
                <div class="left-content-product">
                    <span>${el.stock}</span>
                    <span>${el.name}</span>
                    <span>R$${el.price}</span>
                </div>
            </div>
            `

            if (el.approved > 0) htmlAproved += tmp;
            else htmlWait += tmp;
        });

        $('#product-approved-list').append(htmlAproved);
        $('#product-wait-list').append(htmlWait);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const data = {
        name: $('#name').val(),
        stock: $('#stock').val(),
        price: ($('#price').val()).replace(',', '.'),
        providerid: id
    }

    const query = await $.post('../backend/productController.php?action=create', data);

    if (query !== 'false') {
        Swal.fire(
            `Produto`,
            'Salvo com sucesso.',
            'success'
        );

        getProduct();
        showModal();
    }

}

function showModal() {
    modalCtrl = !modalCtrl;

    if (modalCtrl) {
        $('#modal-new-product').show();
    }
    else $('#modal-new-product').hide();
}

function checkMaxPrice() {
    console.log(parseFloat(($('#price').val()).replace(',', '.')), parseFloat(maxprice));

    const div = document.getElementById('price');
    if (parseFloat(($('#price').val()).replace(',', '.')) > parseFloat(maxprice)) {
        div.setCustomValidity(`Preço máximo por unidade ${maxprice}!`);
    }
    else div.setCustomValidity('');
}