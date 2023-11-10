import {customers, items} from "../db/DB.js";
import {CustomerModel} from "../model/CustomerModel.js";

const cId_reg = /^C\d{3}$/;
const name_reg = /^[A-Za-z\s\-']{3,50}$/;;
const salary_reg = /^\d+(\.\d{2})?$/;


var row_index = -1;

// customers.push(new CustomerModel("C001", "Dasun Madawa", "Horana", 150000));
// customers.push(new CustomerModel("C002", "Dasun Madawa", "Horana", 150000));
// customers.push(new CustomerModel("C003", "Dasun Madawa", "Horana", 150000));
// customers.push(new CustomerModel("C004", "Dasun Madawa", "Horana", 150000));

let searchInput = $(" #c_customer_search ");
let idInput = $(" #c_c_id ");
let nameInput = $(" #c_c_name ");
let addressInput = $(" #c_c_address ");
let salaryInput = $(" #c_c_salary ");


// load all data to table
export const loadAllTableCustomers = () => {
    $("#c_table > tbody").empty();
    customers.map((customer) => {
        $("#c_table > tbody").append(`<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`);
    });

}

loadAllTableCustomers();

const clear = () => {
    $(" #c_clear ").click();

}

// search
$(" #c_search_btn ").on('click', () => {
    if (!cId_reg.test(searchInput.val())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Fill Customer Id Correctly !'
        });
        return;
    }

    try {
        let customer = customers.find(customer => customer.id === $(" #c_customer_search ").val());

        if (customer == null) {
            customer = customers.find(customer => customer.name === $(" #c_customer_search ").val());
        }

        idInput.val(customer.id);
        nameInput.val(customer.name);
        addressInput.val(customer.address);
        salaryInput.val(customer.salary);

        row_index = customers.findIndex(c => c.id === customer.id);
    } catch (e) {
        clear();
        Swal.fire({
            icon: 'info',
            title: 'Cant Find Customer',
            text: 'Check Another ID !'
        });

    }

});

// table select
$(" #c_table ").on('click', 'tr ', function () {
    clear();
    let selectedId = $(this).find("td:first-child").text();
    row_index = customers.findIndex(customer => customer.id === selectedId);

    idInput.val($(this).find("td:first-child").text());
    nameInput.val($(this).find("td:nth-child(2)").text());
    addressInput.val($(this).find("td:nth-child(3)").text());
    salaryInput.val($(this).find("td:nth-child(4)").text());

});

// save
$("#c_save").on('click', () => {
    if (!checkFields()) {
        return;
    }

    if (!checkDuplicates() ){
        return;
    }

    customers.push(new CustomerModel(idInput.val(), nameInput.val(), addressInput.val(), salaryInput.val()));
    loadAllTableCustomers();
    Swal.fire('Saved!', '', 'success');
    clear();

});

// update
$(" #c_update ").on('click', () => {
    if (row_index == -1) {
        Swal.fire(
            'Cant Find Customer',
            'Select or search Customers',
            'question'
        )
        return;
    }

    if (!checkFields()) {
        return;
    }

    Swal.fire({
        title: 'Are you sure to update this Customer?',
        text: " ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update !'
    }).then((result) => {
        if (result.isConfirmed) {
            customers[row_index] = new CustomerModel($("#c_c_id").val(), $("#c_c_name").val(), $("#c_c_address").val(), $("#c_c_salary").val());
            loadAllTableCustomers();
            clear();
            row_index = -1;

            Swal.fire(
                'Updated!',
                'Customer has been Updated.',
                'success'
            )
        }
    });

});

// delete
$(" #c_delete ").on('click', () => {
    if (row_index === -1) {
        Swal.fire(
            'Cant Find Customer',
            'Select or search Customers',
            'question'
        )
        return;
    }

    Swal.fire({
        title: 'Are you sure to delete this customer ?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete !'
    }).then((result) => {
        if (result.isConfirmed) {

            customers.splice(row_index, 1);
            loadAllTableCustomers();
            clear();
            row_index = -1;

            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            )
        }
    });

});

// clear
$(" #c_clear ").on('click', () => {
    idInput.removeClass("is-valid was-validated form-control:valid");
    idInput.removeClass("is-invalid was-validated form-control:invalid");

    nameInput.removeClass("is-valid was-validated form-control:valid");
    nameInput.removeClass("is-invalid was-validated form-control:invalid");

    addressInput.removeClass("is-valid was-validated form-control:valid");
    addressInput.removeClass("is-invalid was-validated form-control:invalid");

    salaryInput.removeClass("is-valid was-validated form-control:valid");
    salaryInput.removeClass("is-invalid was-validated form-control:invalid");

});

function checkDuplicates() {
    let tempCustomer = customers.find(customer => customer.id == idInput.val());
    if (tempCustomer) {
        Swal.fire({
            icon: 'error',
            title: 'Duplicate Customer Ids',
            text: 'Fill Item Code Correctly !'
        });
        return false;
    }
    return true;

}

// validations
let inputFields = [idInput, nameInput, addressInput, salaryInput , searchInput];
let regList = [cId_reg, name_reg, name_reg, salary_reg , cId_reg];

for (let i = 0; i < 5; i++) {
    inputFields[i].on('input', function () {
        if (regList[i].test(inputFields[i].val())) {
            $(this).addClass("is-valid was-validated");
            $(this).removeClass("is-invalid was-validated form-control:invalid");
        } else {
            $(this).addClass("is-invalid was-validated form-control:invalid");
            $(this).removeClass("is-valid was-validated form-control:valid");

        }

    });
}

function checkFields() {
    if (!cId_reg.test(idInput.val())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Fill Customer Id Correctly !'
        });
        idInput.addClass("is-invalid was-validated form-control:invalid");
        return false;
    }

    if (!name_reg.test(nameInput.val())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Fill Customer Name Correctly !'
        });
        nameInput.addClass("is-invalid was-validated form-control:invalid");
        return false;
    }

    if (!name_reg.test(addressInput.val())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Fill Customer Address Correctly !'
        });
        addressInput.addClass("is-invalid was-validated form-control:invalid");
        return false;
    }

    if (!salary_reg.test(salaryInput.val())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Fill Customer Salary Correctly !'
        });
        salaryInput.addClass("is-invalid was-validated form-control:invalid");
        return false;
    }

    return true;

}




