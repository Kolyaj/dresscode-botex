(function() {
    //#imports

    describe('Botex.InlineScript', function() {
        it('</script> escaping', function() {
            var inlineScript = new Botex.InlineScript({
                fn: function(param) {
                    document.body.firstChild.value = '</script>' + param;
                },
                args: ['</script>']
            });

            var iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.contentDocument.open();
            iframe.contentDocument.write('<html><body><textarea></textarea>' + inlineScript + '</body></html>');
            iframe.contentDocument.close();

            chai.assert.equal(iframe.contentDocument.body.firstChild.value, '</script></script>');
            document.body.removeChild(iframe);
        });
    });
})();
