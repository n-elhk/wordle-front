import { DOCUMENT } from '@angular/common';
import {
  ErrorHandler,
  Injectable,
  SecurityContext,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, map, of, share, tap, throwError } from 'rxjs';

/** Icon configuration whose content has already been loaded. */
type LoadedSvgIconConfig = SvgIconConfig & { svgText: string };

/** Options that can be used to configure how an icon or the icons in an icon set are presented. */
export interface IconOptions {
  /** View box to set on the icon. */
  viewBox?: string;

  /** Whether or not to fetch the icon or icon set using HTTP credentials. */
  withCredentials?: boolean;
}

/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * @docs-private
 */
class SvgIconConfig {
  public svgElement: SVGElement | null = null;

  constructor(
    public url: SafeResourceUrl,
    public svgText: string | null,
    public options?: IconOptions
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class IconRegistery {
  private _httpClient = inject(HttpClient);

  private _sanitizer = inject(DomSanitizer);

  private _document = inject(DOCUMENT);

  private _errorHandler = inject(ErrorHandler);

  /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
  private _inProgressUrlFetches = new Map<string, Observable<string>>();

  /**
   * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
   */
  private _svgIconConfigs = new Map<string, SvgIconConfig>();

  /** Cache for icons loaded by direct URLs. */
  private _cachedIconsByUrl = new Map<string, SVGElement>();

  /**
   * Registers an icon by URL in the default namespace.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIcon(
    iconName: string,
    url: SafeResourceUrl,
    options?: IconOptions
  ): this {
    return this.addSvgIconInNamespace('', iconName, url, options);
  }

  /**
   * Registers an icon by URL in the specified namespace.
   * @param namespace Namespace in which the icon should be registered.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIconInNamespace(
    namespace: string,
    iconName: string,
    url: SafeResourceUrl,
    options?: IconOptions
  ): this {
    return this._addSvgIconConfig(
      namespace,
      iconName,
      new SvgIconConfig(url, null, options)
    );
  }

  /**
   * Registers an icon config by name in the specified namespace.
   * @param namespace Namespace in which to register the icon config.
   * @param iconName Name under which to register the config.
   * @param config Config to be registered.
   */
  private _addSvgIconConfig(
    namespace: string,
    iconName: string,
    config: SvgIconConfig
  ): this {
    this._svgIconConfigs.set(iconName, config);
    return this;
  }

  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
   * and namespace. The icon must have been previously registered with addIcon or addIconSet;
   * if not, the Observable will throw an error.
   *
   * @param name Name of the icon to be retrieved.
   * @param namespace Namespace in which to look for the icon.
   */
  getNamedSvgIcon(
    name: string,
    namespace: string = ''
  ): Observable<SVGElement> {
    let config = this._svgIconConfigs.get(name);

    // Return (copy of) cached icon if possible.
    if (config) {
      return this._getSvgFromConfig(config);
    }

    return throwError(() => 'Icon not found');
  }

  /**
   * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
   */
  private _getSvgFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgText) {
      // We already have the SVG element for this icon, return a copy.
      return of(
        this.cloneSvg(this._svgElementFromConfig(config as LoadedSvgIconConfig))
      );
    } else {
      // Fetch the icon from the config's URL, cache it, and return a copy.
      return this._loadSvgIconFromConfig(config).pipe(
        map((svg) => this.cloneSvg(svg))
      );
    }
  }

  /**
   * Returns an Observable which produces the string contents of the given icon. Results may be
   * cached, so future calls with the same URL may not cause another HTTP request.
   */
  private _fetchIcon(iconConfig: SvgIconConfig): Observable<string> {
    const { url: safeUrl, options } = iconConfig;
    const withCredentials = options?.withCredentials ?? false;

    // if (!this._httpClient) {
    //   throw getMatIconNoHttpProviderError();
    // }

    // TODO: add an ngDevMode check
    if (safeUrl == null) {
      throw Error(`Cannot fetch icon from URL "${safeUrl}".`);
    }

    const url = this._sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      safeUrl
    )!;

    // // TODO: add an ngDevMode check
    // if (!url) {
    //   throw getMatIconFailedToSanitizeUrlError(safeUrl);
    // }

    // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
    // already a request in progress for that URL. It's necessary to call share() on the
    // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
    const inProgressFetch = this._inProgressUrlFetches.get(url);

    if (inProgressFetch) {
      return inProgressFetch;
    }

    const req = this._httpClient
      .get(url, { responseType: 'text', withCredentials })
      .pipe(
        map((svg) => {
          // Security: This SVG is fetched from a SafeResourceUrl, and is thus
          // trusted HTML.
          return svg;
        }),
        finalize(() => this._inProgressUrlFetches.delete(url)),
        share()
      );

    this._inProgressUrlFetches.set(url, req);
    return req;
  }

  /**
   * Creates a DOM element from the given SVG string.
   */
  private _svgElementFromString(str: string): SVGElement {
    const div = this._document.createElement('DIV');
    div.innerHTML = str as unknown as string;
    const svg = div.querySelector('svg') as SVGElement;

    // TODO: add an ngDevMode check
    if (!svg) {
      throw Error('<svg> tag not found');
    }

    return svg;
  }

  /**
   * Sets the default attributes for an SVG element to be used as an icon.
   */
  private _setSvgAttributes(
    svg: SVGElement,
    options?: IconOptions
  ): SVGElement {
    svg.setAttribute('fit', '');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.

    if (options && options.viewBox) {
      svg.setAttribute('viewBox', options.viewBox);
    }

    return svg;
  }

  /** Parses a config's text into an SVG element. */
  private _svgElementFromConfig(config: LoadedSvgIconConfig): SVGElement {
    if (!config.svgElement) {
      const svg = this._svgElementFromString(config.svgText);
      this._setSvgAttributes(svg, config.options);
      config.svgElement = svg;
    }

    return config.svgElement;
  }

  /**
   * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
   * from it.
   */
  private _loadSvgIconFromConfig(
    config: SvgIconConfig
  ): Observable<SVGElement> {
    return this._fetchIcon(config).pipe(
      tap((svgText) => (config.svgText = svgText)),
      map(() => this._svgElementFromConfig(config as LoadedSvgIconConfig))
    );
  }

  /** Clones an SVGElement while preserving type information. */
  cloneSvg(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }
}
