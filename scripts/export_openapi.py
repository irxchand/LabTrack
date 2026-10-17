from pathlib import Path
import yaml
from labtrack.api import app

path = Path("contracts/openapi.yaml")
path.parent.mkdir(exist_ok=True)
path.write_text(yaml.safe_dump(app.openapi(), sort_keys=False, allow_unicode=True), encoding="utf-8")
print(f"Exported {len(app.openapi()['paths'])} API paths")
