const name = localStorage.getItem('name');
const id = localStorage.getItem('id');
let listProduct = [];
let modalCtrl = false;
let productSelected = null;

$().ready(() => {
    $('#modal-new-product').hide();

    Swal.fire(
        `Olá ${name}`,
        'Seja bem vindo!',
        'success'
    );

    getRequest();
    getProduct();

    $("#product-list").select2();
    $('#amount').mask('9');
});

async function getRequest() {
    $('#request-approved-list').html('');
    $('#request-wait-list').html('');

    try {
        let listRequest = JSON.parse(
            await $.get(`../backend/requestController.php?action=selectByUser&id=${id}`)
        );

        let htmlAproved = '';
        let htmlWait = '';
        if (listRequest.length > 0) {
            listRequest.forEach(el => {
                let tmp = `
                    <div class="left-content box-card">
                        <div class="left-content-header">
                            <span>${el.date}</span>
                        </div>

                        <div>
                            <span>${el.prodname}</span>
                            <p>
                                <span>${el.amount}</span>
                                <span>Total R$${el.amount * el.price}</span>
                            </p>
                        </div>

                        <div>
                            <span>${el.providername}</span>
                            <p>
                                <span>${el.phone}</span>
                                <span>${el.email}</span>
                            </p>
                            <span>${el.address}, ${el.city}-${el.state}</span>
                        </div>
                    </div>
                `

                if (el.approved > 0) htmlAproved += tmp;
                else htmlWait += tmp;
            });

            $('#request-approved-list').append(htmlAproved);
            $('#request-wait-list').append(htmlWait);
        }
    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function getProduct() {
    $('#product-list').html('');

    try {
        listProduct = JSON.parse(
            await $.get(`../backend/productController.php?action=selectAllApproved`)
        );

        let html = '<option value="0" disabled selected>Escolha um produto</option>';
        listProduct.forEach(el => {
            html += `<option value="${el.id}">${el.name} - ${el.city}/${el.state} </option>`;
        });

        $('#product-list').append(html);

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

function handleSelectProduct() {
    productSelected = listProduct[$("#product-list").prop('selectedIndex') - 1];

    $('#name').val(productSelected.name);
    $('#price').val(productSelected.price);
    $('#stock').val(productSelected.stock);
    $('#prov-name').val(productSelected.provname);
    $('#phone').val(productSelected.phone);
    $('#email').val(productSelected.email);
    $('#address').val(`${productSelected.address}, ${productSelected.city} - ${productSelected.state}`);
}

async function handleSubmit(event) {
    event.preventDefault();
    const div = document.getElementById('product-list');

    if (productSelected) {
        try {
            const data = {
                userid: id,
                productid: productSelected.id,
                amount: $('#amount').val()
            }

            const query = await $.post('../backend/requestController.php?action=create', data);

            if (query !== 'false') {
                successInform();

                getRequest();
                showModal();
            }
            else errorInform();

        } catch (error) {
            console.log(error);
            errorInform();
        }
    }
}

function handleTotal() {
    if (productSelected) {
        $('#total-price').val($('#amount').val() * productSelected.price)
    }
}

function showModal() {
    modalCtrl = !modalCtrl;

    if (modalCtrl) {
        $('#modal-new-product').show();
    }
    else {
        productSelected = null;
        $('#modal-new-product').hide();
    }
}

function logout() {
    Swal.fire({
        title: 'Sair',
        text: "Quer mesmo sair do sistema?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69a7db',
        cancelButtonColor: '#D93644',
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            localStorage.clear();
            window.location = './index.html';
        }
    })
}