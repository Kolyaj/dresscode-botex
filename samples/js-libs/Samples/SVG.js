Botex.CSS.add({
    '.$$__circle': {
        'stroke': 'blue'
    },
    '.$$__circle_red': {
        'fill': 'red'
    },
    '.$$__circle_yellow': {
        'fill': 'yellow'
    }
});

Samples.SVG = Bricks.inherit(Botex.Widget, {
    _render: function() {
        var timer = new Quantum.Quant(0);
        setInterval(function() {
            timer.setValue(timer.getValue() + 1);
        }, 100);

        return {
            tagName: 'svg',
            style: {
                'width,height': timer.when(function(i) {
                    var size = 50 + (i % 50);
                    return [size, size];
                })
            },
            attrs: {
                xmlns: 'http://www.w3.org/2000/svg',
                height: '100',
                width: '100'
            },
            content: Botex.zen('circle.$$__circle[cx=50][cy=50][stroke-width=3][xmlns=http://www.w3.org/2000/svg]', {
                className: timer.when(function(i) {
                    return ['$$__circle_red', '$$__circle_yellow'][Math.round(i / 10) % 2];
                }),
                attrs: {
                    r: timer.when(function(i) {
                        return 40 + (i % 10);
                    })
                }
            })
        };
    }
});
