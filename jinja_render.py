from pathlib import Path

from jinja2 import Environment, FileSystemLoader


def render_html_from_json_data(
    data: dict,
    template_dir: Path,
    template_filename: str,
) -> str:
    """
    Renders HTML from a dictionary using a Jinja2 template.

    Args:
        data: A dictionary containing the data to render.
        template_dir: The directory where the Jinja2 template file is located.
        template_filename: The filename of the Jinja2 template file.

    Returns:
        The rendered HTML string.
    """
    env = Environment(loader=FileSystemLoader(str(template_dir)))
    template = env.get_template(template_filename)
    return template.render(**data)
