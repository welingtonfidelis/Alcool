const name = localStorage.getItem('name');
const id = localStorage.getItem('id');
const maxprice = localStorage.getItem('maxprice');
let modalCtrl = false;

$().ready(() => {
    $('#modal-new').hide();

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
    $('#request-approved-list').html('');
    $('#request-wait-list').html('');

    try {
        let listRequest = JSON.parse(
            await $.get(`../backend/requestController.php?action=selectByProvider&id=${id}`)
        );

        let htmlAproved = '';
        let htmlWait = '';
        if (listRequest.length > 0) {
            listRequest.forEach(el => {
                let tmp = `
                    <div class="left-content box-card">
                        <div class="left-content-header">
                            <span><strong>Data: </strong>${el.date}</span>
                            <span title="Nível de risco"><strong>Nível de risco: </strong> ${el.risklevel}</span>
                        </div>

                        <div>
                            <span><strong>Nome: </strong>${el.username}</span>
                            <p>
                                <span><strong>Telefone: </strong>${el.phone}</span>
                                <span><strong>E-mail: </strong>${el.email}</span>
                            </p>
                        </div>

                        <div>
                            <span><strong>Endereço: </strong>${el.address}, ${el.city}-${el.state}</span>
                        </div>

                        <div class="left-content-product">
                            <span><strong>Quantidade: </strong>${el.amount}</span>
                            <span><strong>Produto: </strong>${el.prodname}</span>
                            <span><strong>Total: </strong>R$${el.amount * el.price}</span>
                        </div>
                `

                if (el.approved > 0) {
                    tmp += '</div>';
                    htmlAproved += tmp;
                }
                else {
                    tmp += `
                        <div id="btn-approve-request" class="left-content-footer">
                                <button onclick="handleApprove(${el.id});">Aprovar</button>
                            </div>
                        </div>
                    `;
                    htmlWait += tmp;
                }
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
    $('#product-approved-list').html('');
    $('#product-wait-list').html('');

    try {
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
                        <span><strong>Estoque: </strong>${el.stock}</span>
                        <span><strong>Nome: </strong>${el.name}</span>
                        <span><strong>Preço un: </strong>R$${el.price}</span>
                    </div>
                </div>
                `

                if (el.approved > 0) htmlAproved += tmp;
                else htmlWait += tmp;
            });

            $('#product-approved-list').append(htmlAproved);
            $('#product-wait-list').append(htmlWait);
        }
    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    try {
        const data = {
            name: $('#name').val(),
            stock: $('#stock').val(),
            price: ($('#price').val()).replace(',', '.'),
            providerid: id
        }

        const query = await $.post('../backend/productController.php?action=create', data);

        if (query !== 'false') {
            successInform();

            getProduct();
            showModal();
        }
        else errorInform();

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function handleApprove(id) {
    try {
        const query = await $.post(`../backend/requestController.php?action=aproveRequest&id=${id}`, {
            approved: true
        });

        if (query !== 'false') {
            successInform();

            getRequest();
        }
        else errorInform();

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

function showModal() {
    modalCtrl = !modalCtrl;

    if (modalCtrl) {
        $('#modal-new').show();
    }
    else $('#modal-new').hide();
}

function checkMaxPrice() {
    const div = document.getElementById('price');
    if (parseFloat(($('#price').val()).replace(',', '.')) > parseFloat(maxprice)) {
        div.setCustomValidity(`Preço máximo por unidade ${maxprice}!`);
    }
    else div.setCustomValidity('');
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