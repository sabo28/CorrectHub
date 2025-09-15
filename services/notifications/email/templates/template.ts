export default class Template {
  private text: string = "";
  private html: string = "";
  private loaded: boolean = false;

  constructor(
    private readonly template: string,
    private readonly variables: Record<string, string | number> = {},
  ) {}

  async load(): Promise<void> {
    if (this.loaded) {
      return;
    }

    const templateFileBase = `${import.meta.dirname}/${this.template}`;
    const baseTemplateFile = `${import.meta.dirname}/_base.html`;

    const base = await Deno.readTextFile(baseTemplateFile);
    const html = replaceVariables(
      await Deno.readTextFile(`${templateFileBase}.html`),
      this.variables,
    );

    this.text = replaceVariables(
      await Deno.readTextFile(`${templateFileBase}.md`),
      this.variables,
    );
    this.html = replaceVariables(
      base,
      { _unsafe_content: html },
    );
    this.loaded = true;
  }

  async getText() {
    await this.load();
    return this.text;
  }

  async getHtml() {
    await this.load();
    return this.html;
  }
}

export function replaceVariables(
  content: string,
  variables: Record<string, string | number>,
): string {
  return content.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    let replacement = `{{${key}}}`;

    if (variables[trimmedKey] != null) {
      replacement = String(variables[trimmedKey]);
    }

    if (!trimmedKey.startsWith("_unsafe_")) {
      replacement = sanitizeHtml(replacement);
    }

    return replacement;
  });
}

export function sanitizeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#49;";

      default:
        throw new Error(`unknown character '${match}'`);
    }
  });
}
