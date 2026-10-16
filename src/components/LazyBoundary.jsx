import { Component } from "react";

export default class LazyBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="demo-placeholder" role="alert">
          <p>
            No se pudo cargar este contenido. Vuelve a cargar la página para
            intentarlo de nuevo.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Volver a cargar
          </button>
          {this.props.onDismiss && (
            <button type="button" onClick={this.props.onDismiss}>
              Cerrar
            </button>
          )}
        </div>
      );
    return this.props.children;
  }
}
