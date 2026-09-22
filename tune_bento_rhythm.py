from pathlib import Path
p=Path('/home/ubuntu/vyce-voice-agent/client/src/index.css')
css=p.read_text()
css += '''\n\n/* Final bento rhythm correction */\n.bento-feature-grid .platform-feature:nth-child(1) { grid-row: auto; min-height: 470px; }\n@media (max-width: 980px) { .bento-feature-grid .platform-feature:nth-child(1) { grid-row: auto; min-height: 400px; } }\n@media (max-width: 600px) { .bento-feature-grid .platform-feature:nth-child(1) { min-height: 365px; } }\n'''
p.write_text(css)
