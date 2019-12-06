function textBox(){
    let headBlurb = `At the beginning of the year,`
    let textBlurb = ` 
    each governor lays out their policy priorities in their version of the State of the Union address — a 
    “state of the state” address. The team at 538 conducted a text analysis of all 50 governors’ 2019 state 
    of the state speeches to see what issues were talked about the most and whether there were differences 
    between what Democratic and Republican governors were focusing on. 
    `
    let textDiv = d3.select('#header-wrap')
    .append('div');
    textDiv.style('opacity', 0)
    .classed('text-blurb', true)
    .transition()
    .delay(700).style('opacity', 1);

    textDiv.append('span').append('text')
    .attr('opacity', 0)
    .text(headBlurb);
    textDiv.append('text').text(textBlurb);
}


function highlightExtreme(data, circleScale, circles){

    function blurbBox(party, group, pos){

        let newGroup = group.append('g');

        newGroup.append('text').text(`${party} speeches`)
        .attr('x', pos[0] + 10)
        .attr('y', pos[1] - 120);
        newGroup.append('text').text(d=> ` mentioned ${d.phrase}`).classed('highlight', true)
        .attr('x', pos[0] + 10)
        .attr('y', pos[1] - 100);
        newGroup.append('text').text(d=> `${Math.abs(d.position)}% more`)
        .attr('x', d=> pos[0] + 10)
        .attr('y', d=> pos[1] - 80);

        return newGroup;
    }

    let max = d3.max(data.map(d=> d.position));
    let min = d3.min(data.map(d=> d.position));
   
    let paneWrap = d3.select('body').append('div').attr('class', 'pane')
    let pane = paneWrap.append('svg')
    let rect = pane.append('rect')
    .classed('pane-rect', true)
    .attr('opacity', 0)
    .transition()
    .delay(500).attr('opacity', 0.5);

    let demEx = circles.filter(d => d.position === min);
    let demPos = [demEx.node().getBoundingClientRect().x + 5, demEx.node().getBoundingClientRect().y + 5];

    let repEx = circles.filter(d => d.position === max);
    let repPos = [repEx.node().getBoundingClientRect().x + 5, repEx.node().getBoundingClientRect().y + 5];

    let demGroup = pane.selectAll('g.dem-story').data(demEx.data()).join('g')
    .classed('dem-story', true);

    demGroup.append('line')
    .attr('opacity', 0)
    .attr('x1', demPos[0])
    .attr('x2', demPos[0])
    .attr('y1', demPos[1] - 150)
    .attr('y2', demPos[1])
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .transition()
    .delay(500)
    .attr('opacity', 1);

    demGroup.append('rect')
    .attr('width', 240)
    .attr('height', 100)
    .attr('opacity', 0)
    .attr('x', demPos[0])
    .attr('y', demPos[1] - 150)
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .transition()
    .delay(500)
    .attr('fill', '#fff')
    .attr('opacity', 1);

    demGroup.selectAll('circle').data(d=> [d]).join('circle')
    .attr('opacity', 0)
    .attr('cx', demPos[0])
    .attr('cy', demPos[1])
    .attr('r', d=> circleScale(d.total))
    .attr('fill', '#2874A6')
    .transition()
    .delay(500)
    .attr('opacity', 1);

    let dGroup = blurbBox('Democratic', demGroup, demPos);
    dGroup.attr('opacity', 0)
    .attr('x', d=> d.moveX + 80)
    .attr('y', d=> d.moveY + 200)
    .transition()
    .delay(500)
    .attr('opacity', 1);

    let repGroup = pane.selectAll('g.rep-story').data(repEx.data()).join('g')
    .classed('rep-story', true);

    repGroup.append('line')
    .attr('opacity', 0)
    .attr('x1', repPos[0])
    .attr('x2', repPos[0])
    .attr('y1', repPos[1] - 150)
    .attr('y2', repPos[1])
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .transition()
    .delay(500)
    .attr('opacity', 1);

    repGroup.append('rect')
    .attr('width', 250)
    .attr('height', 100)
    .attr('opacity', 0)
    .attr('fill', '#fff')
    .attr('x', repPos[0])
    .attr('y', repPos[1] - 150)
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .transition()
    .delay(500)
    .attr('opacity', 1);

    let rGroup = blurbBox('Republican', repGroup, repPos);
    rGroup.attr('opacity', 0)
    .attr('x', d=> d.moveX + 80)
    .attr('y', d=> d.moveY + 200)
    .transition()
    .delay(500)
    .attr('opacity', 1);


    repGroup.selectAll('circle.rep').data(d=> [d]).join('circle')
    .classed('rep', true)
    .attr('opacity', 0)
    .attr('cx', repPos[0]+2)
    .attr('cy', repPos[1]+2)
    .attr('r', d=> circleScale(d.total))
    .attr('fill', '#E74C3C')
    .transition()
    .delay(500)
    .attr('opacity', 1);

    pane.on('click', function(){
        paneWrap.remove();
        //textDiv.remove();
    });


}