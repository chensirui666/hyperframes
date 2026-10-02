import test from 'node:test';
import assert from 'node:assert/strict';
import {SHOTS, DURATION, shotAt, DIALOGUE, EVENTS} from '../src/timeline.js';
test('the approved sixteen shots cover exactly 48 seconds with no gap',()=>{
 assert.equal(DURATION,48);assert.equal(SHOTS.length,16);assert.equal(SHOTS[0].start,0);
 SHOTS.forEach((s,i)=>{assert.ok(s.end>s.start);if(i)assert.equal(s.start,SHOTS[i-1].end);});
 assert.equal(SHOTS.at(-1).end,48);
});
test('seeking a cut selects the next shot and the end remains valid',()=>{
 assert.equal(shotAt(0).id,1);assert.equal(shotAt(32.499).id,12);assert.equal(shotAt(32.5).id,13);assert.equal(shotAt(48).id,16);
});
test('all dialogue is attached to speakers and timed outside the silence',()=>{
 assert.ok(DIALOGUE.length>=8);DIALOGUE.forEach(d=>{assert.ok(d.speaker);assert.equal(d.presentation,'bubble');assert.ok(d.end>d.start);assert.ok(d.end<=48);assert.ok(!(d.start<33&&d.end>32.5));});
});
test('critical musical and picture anchors agree',()=>{
 assert.equal(EVENTS.transform,29);assert.equal(EVENTS.reveal,31.5);assert.equal(EVENTS.reaction,32.5);assert.equal(EVENTS.contact,39.3);assert.equal(EVENTS.flash,47.1);
});
