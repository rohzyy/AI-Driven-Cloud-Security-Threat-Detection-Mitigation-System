// Simple 3D Workflow Visualization - Guaranteed to work
(function () {
    'use strict';

    function initWorkflow() {
        const container = document.getElementById('workflow-3d-container');
        if (!container) {
            console.error('workflow-3d-container not found!');
            return;
        }

        console.log('✅ Initializing 3D Workflow...');

        container.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                perspective: 1200px;
            ">
                <div class="workflow-3d" style="
                    position: relative;
                    width: 600px;
                    height: 400px;
                    transform-style: preserve-3d;
                    animation: rotate3d 25s infinite linear;
                ">
                    <!-- Node 1: Incoming Threats -->
                    <div class="node" style="
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate3d(-250px, -100px, 150px) translate(-50%, -50%);
                    ">
                        <div style="
                            width: 120px;
                            padding: 20px;
                            background: linear-gradient(135deg, rgba(255,77,77,0.2), rgba(255,77,77,0.4));
                            border: 2px solid #ff4d4d;
                            border-radius: 12px;
                            text-align: center;
                            box-shadow: 0 8px 32px rgba(255,77,77,0.4);
                            animation: pulse 2s infinite;
                        ">
                            <div style="font-size: 32px; margin-bottom: 8px;">🌐</div>
                            <div style="font-size: 12px; font-weight: bold; color: white;">Incoming Threats</div>
                            <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px;">DoS, Exploits</div>
                        </div>
                    </div>
                    
                    <!-- Node 2: AI Detection -->
                    <div class="node" style="
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate3d(-80px, -150px, 50px) translate(-50%, -50%);
                    ">
                        <div style="
                            width: 120px;
                            padding: 20px;
                            background: linear-gradient(135deg, rgba(19,127,236,0.2), rgba(19,127,236,0.4));
                            border: 2px solid #137fec;
                            border-radius: 12px;
                            text-align: center;
                            box-shadow: 0 8px 32px rgba(19,127,236,0.4);
                            animation: pulse 2s infinite 0.5s;
                        ">
                            <div style="font-size: 32px; margin-bottom: 8px;">🤖</div>
                            <div style="font-size: 12px; font-weight: bold; color: white;">AI Detection</div>
                            <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px;">Dual ML Models</div>
                        </div>
                    </div>
                    
                    <!-- Node 3: Classification -->
                    <div class="node" style="
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate3d(80px, 0px, -50px) translate(-50%, -50%);
                    ">
                        <div style="
                            width: 120px;
                            padding: 20px;
                            background: linear-gradient(135deg, rgba(255,176,0,0.2), rgba(255,176,0,0.4));
                            border: 2px solid #ffb000;
                            border-radius: 12px;
                            text-align: center;
                            box-shadow: 0 8px 32px rgba(255,176,0,0.4);
                            animation: pulse 2s infinite 1s;
                        ">
                            <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
                            <div style="font-size: 12px; font-weight: bold; color: white;">Classification</div>
                            <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px;">95% Accurate</div>
                        </div>
                    </div>
                    
                    <!-- Node 4: Mitigation -->
                    <div class="node" style="
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate3d(250px, 100px, -150px) translate(-50%, -50%);
                    ">
                        <div style="
                            width: 120px;
                            padding: 20px;
                            background: linear-gradient(135deg, rgba(0,255,157,0.2), rgba(0,255,157,0.4));
                            border: 2px solid #00ff9d;
                            border-radius: 12px;
                            text-align: center;
                            box-shadow: 0 8px 32px rgba(0,255,157,0.4);
                            animation: pulse 2s infinite 1.5s;
                        ">
                            <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
                            <div style="font-size: 12px; font-weight: bold; color: white;">Mitigation</div>
                            <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px;">Block & Limit</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rotate3d {
                0% { transform: rotateY(0deg) rotateX(10deg); }
                100% { transform: rotateY(360deg) rotateX(10deg); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.9; }
            }
            
            .workflow-3d .node:hover > div {
                transform: translate(-50%, -50%) scale(1.15) !important;
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ 3D Workflow loaded successfully!');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorkflow);
    } else {
        initWorkflow();
    }
})();
