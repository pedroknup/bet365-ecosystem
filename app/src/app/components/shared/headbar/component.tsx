import * as React from 'react';
import './styles.scss';
import { bet } from '../../../../../../main/src/entities/bet';

interface IBetInfoProps {
  bet: bet;
}

export const BetInfo = (props: IBetInfoProps) => {
  if (!props.bet.match) return <div />;
  return <div className="head-bar">
      <div>
        <div id="DIV_1">
          <div id="DIV_2">
            <div id="DIV_3">
              <div id="DIV_4">
                <span id="SPAN_5">aaa</span>
              </div>
              <div id="DIV_6">
                Venue:
                <span id="SPAN_7" />
              </div>
              <div id="DIV_8">
                Attendance:
                <span id="SPAN_9" />
              </div>
              <div id="DIV_10">
                Weather:
                <span id="SPAN_11" />
              </div>
              <div id="DIV_12">
                Pitch:
                <span id="SPAN_13" />
              </div>
            </div>
          </div>

          <div id="DIV_118">
            {/* <div style={{ height: 34, border: '1px solid black' }} id="DIV_119">
              <div id="DIV_121">{props.bet.match.teamA}</div>

              <div style={{ marginTop: -8, height: 10 }} id="DIV_131">
                <div id="DIV_133">
                  <div id="DIV_134">{props.bet.match.scoreA}</div>
                  <div id="DIV_135" />
                  <div id="DIV_141">{props.bet.match.scoreB}</div>
                </div>
              </div>

              <div id="DIV_143">{props.bet.match.teamB}</div>
            </div> */}
            <div id="DIV_119">
              <div id="DIV_120">
                <div id="DIV_121">Attacks</div>
                <div id="DIV_122">
                  <div id="DIV_123">{props.bet.match.attacksA}</div>
                  <div id="DIV_124">
                    <svg id="svg_125">
                      <g id="g_126">
                        <path id="path_127" />
                        <path id="path_128" />
                        <path id="path_129" />
                      </g>
                    </svg>
                  </div>
                  <div id="DIV_130">{props.bet.match.attacksB}</div>
                </div>
              </div>
              <div id="DIV_131">
                <div id="DIV_132">Dangerous Attacks</div>
                <div id="DIV_133">
                  <div id="DIV_134">{props.bet.match.dangerousAttackA}</div>
                  <div id="DIV_135">
                    <svg id="svg_136">
                      <g id="g_137">
                        <path id="path_138" />
                        <path id="path_139" />
                        <path id="path_140" />
                      </g>
                    </svg>
                  </div>
                  <div id="DIV_141">{props.bet.match.dangerousAttackB}</div>
                </div>
              </div>
              <div id="DIV_142">
                <div id="DIV_143">Possession %</div>
                <div id="DIV_144">
                  <div id="DIV_145">{props.bet.match.possessionA}</div>
                  <div id="DIV_146">
                    <svg id="svg_147">
                      <g id="g_148">
                        <path id="path_149" />
                        <path id="path_150" />
                        <path id="path_151" />
                      </g>
                    </svg>
                  </div>
                  <div id="DIV_152">{props.bet.match.possessionB}</div>
                </div>
              </div>
            </div>
            <div id="DIV_153">
              <div id="DIV_154">
                <div id="DIV_155">
                  <div id="DIV_156">
                    <div id="DIV_157">
                      <div id="DIV_158" />
                      <div id="DIV_159">{props.bet.match.cornerKickA}</div>
                    </div>
                    <div id="DIV_160">
                      <div id="DIV_161" />
                      <div id="DIV_162">{props.bet.match.redCardA}</div>
                    </div>
                    <div id="DIV_163">
                      <div id="DIV_164" />
                      <div id="DIV_165">{props.bet.match.yellowCardA}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="DIV_166">
                <div id="DIV_167">
                  <div id="DIV_168">
                    <h4 id="H4_169">On Target</h4>
                    <div id="DIV_170">
                      <b id="B_171">{props.bet.match.onTargetA}</b>
                      <div id="DIV_172">
                        <span id="SPAN_173" />
                      </div>
                      <b id="B_174">{props.bet.match.onTargetB}</b>
                    </div>
                  </div>
                </div>
                <div id="DIV_175">
                  <div id="DIV_176">
                    <h4 id="H4_177">Off Target</h4>
                    <div id="DIV_178">
                      <b id="B_179">{props.bet.match.offTargetA}</b>
                      <div id="DIV_180">
                        <span id="SPAN_181" />
                      </div>
                      <b id="B_182">{props.bet.match.offTargetB}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div id="DIV_183">
                <div id="DIV_184">
                  <div id="DIV_185">
                    <div id="DIV_186">
                      <div id="DIV_187" />
                      <div id="DIV_188">{props.bet.match.yellowCardB}</div>
                    </div>
                    <div id="DIV_189">
                      <div id="DIV_190" />
                      <div id="DIV_191">{props.bet.match.redCardB}</div>
                    </div>
                    <div id="DIV_192">
                      <div id="DIV_193" />
                      <div id="DIV_194">{props.bet.match.cornerKickB}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="DIV_195">
              <div id="DIV_196">
                <div id="DIV_197">Summary</div>
                <div id="DIV_198">
                  <div id="DIV_199">Table</div>
                </div>
              </div>
            </div>
            <div id="DIV_200" />
          </div>
        </div>
      </div>
    </div>;
};
