/* global $ */

console.log("connected!");

$(document).ready(function() {
    
    var itemsInStore;
    
    $('#home-tab').on('click', function() {
        $('#store').hide();
        $('#store-tab').parent().removeClass('active');
        $('#upload').hide();
        $('#upload-tab').parent().removeClass('active');
        $('#home').show();
        $('#home-tab').parent().addClass('active');
    });
    $('#store-tab').on('click', function() {
        $('#home').hide();
        $('#home-tab').parent().removeClass('active');
        $('#upload').hide();
        $('#upload-tab').parent().removeClass('active');
        $('#store').show();
        $('#store-tab').parent().addClass('active');
        
        $.ajax({
            type: 'GET',
            url: '/items',
            success: function(newItems) {
                if(itemsInStore === undefined) {
                    console.log(newItems);
                    itemsInStore = newItems;
                    appendItems(itemsInStore);
                } else if (itemsInStore.length < newItems.length || itemsInStore.length > newItems.length) {
                    itemsInStore = newItems;
                    appendItems(itemsInStore);
                }
            },
            // Bug detected: look into success callback when you wake up.
            error: function(error) {
                console.log("Ooops, something went wrong ='(");
            }
        });
    });
    $('#upload-tab').on('click', function() {
        $('#home').hide();
        $('#home-tab').parent().removeClass('active');
        $('#store').hide();
        $('#store-tab').parent().removeClass('active');
        $('#upload').show();
        $('#upload-tab').parent().addClass('active');
    });
    
    $('#upload form').on('submit', function(event) {
        event.preventDefault();
        var form = $(this);
        var itemData = form.serialize();
        console.log(itemData);
        $.ajax({
            type: 'POST',
            url: '/items',
            data: itemData,
            success: function() {
                console.log(`item sent!!!`);
                $('#upload').find('.form-control').val('');
                $('#success-item-status').show();
            },
            error: function() {
                console.log('Item not sent :(');
            }
        });
    });
    
});

function updateItemsInStore (newItems, previousItems) {
    console.log(newItems);
    console.log(newItems.length);
}

function appendItems(items) {
    $.each(items, function(index, item) {
        $('#store').append(`<div class="col-md-4"><div class="well"><h3>${item.item_name}</h3><p>${item.item_description}</p><p>${item.item_price}</p></div></div>`);
    });
}