import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'activity.dart';
import 'shop.dart';

/// Where each provider sits: its level (sources first, then what derives from
/// them) and its slot across that level, from 0 to 1, for wide graphs (flowing
/// left to right) and narrow ones (top to bottom), where the slots are tighter.
const _layout = <String, (int, {double wide, double narrow})>{
  'cart': (0, wide: 0.1, narrow: 0),
  'discount': (0, wide: 0.55, narrow: 0.5),
  'currency': (0, wide: 1, narrow: 1),
  'itemCount': (1, wide: 0, narrow: 0),
  'subtotal': (1, wide: 0.4, narrow: 0.5),
  'total': (2, wide: 0.55, narrow: 0.75),
  'totalLabel': (3, wide: 0.9, narrow: 1),
};

/// Below this width the graph flows top to bottom.
const verticalBelow = 560.0;

const _nodeSize = Size(100, 52);

/// The providers as a live graph: a node flashes each time its provider recomputes.
class ProviderGraph extends ConsumerWidget {
  const ProviderGraph({super.key, required this.activity});

  final Activity activity;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final values = <String, String>{
      'cart': '${ref.watch(cartProvider).length} lines',
      'discount': ref.watch(discountProvider) ? 'on' : 'off',
      'currency': ref.watch(currencyProvider).name.toUpperCase(),
      'itemCount': '${ref.watch(itemCountProvider)}',
      'subtotal': '€${ref.watch(subtotalProvider).toStringAsFixed(2)}',
      'total': '€${ref.watch(totalProvider).toStringAsFixed(2)}',
      'totalLabel': ref.watch(totalLabelProvider),
    };
    return LayoutBuilder(
      builder: (context, box) {
        final vertical = box.maxWidth < verticalBelow;
        Offset at(String name) {
          final (level, :wide, :narrow) = _layout[name]!;
          final w = box.maxWidth - _nodeSize.width;
          final h = box.maxHeight - _nodeSize.height;
          return vertical
              ? Offset(narrow * w, level / 3 * h)
              : Offset(level / 3 * w, wide * h);
        }

        return ListenableBuilder(
          listenable: activity,
          builder: (context, _) => Stack(
            children: [
              Positioned.fill(
                child: CustomPaint(
                  painter: _EdgePainter({
                    for (final name in _layout.keys) name: at(name),
                  }, vertical: vertical),
                ),
              ),
              for (final name in _layout.keys)
                Positioned(
                  left: at(name).dx,
                  top: at(name).dy,
                  child: _Node(
                    // A new key on each update restarts the flash.
                    key: ValueKey('$name-${activity.lastUpdate[name]}'),
                    name: name,
                    value: values[name]!,
                    updates: activity.updates[name] ?? 0,
                    flash: activity.lastUpdate[name] != null,
                    source: providerGraph[name]!.isEmpty,
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _Node extends StatelessWidget {
  const _Node({
    super.key,
    required this.name,
    required this.value,
    required this.updates,
    required this.flash,
    required this.source,
  });

  final String name;
  final String value;
  final int updates;
  final bool flash;
  final bool source;

  @override
  Widget build(BuildContext context) {
    final accent = source ? DemoColors.coral : DemoColors.mint;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: flash ? 1 : 0, end: 0),
      duration: const Duration(milliseconds: 900),
      curve: Curves.easeOut,
      builder: (context, glow, child) => Container(
        width: _nodeSize.width,
        height: _nodeSize.height,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: Color.lerp(
            DemoColors.surface,
            accent.withValues(alpha: 0.35),
            glow,
          ),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: Color.lerp(DemoColors.line, accent, 0.35 + glow * 0.65)!,
          ),
        ),
        child: child,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  name,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 12, color: accent),
                ),
              ),
              Text(
                '×$updates',
                style: const TextStyle(fontSize: 11, color: DemoColors.muted),
              ),
            ],
          ),
          Text(
            value,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontFamily: 'JetBrainsMono',
              package: 'demo_kit',
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

class _EdgePainter extends CustomPainter {
  _EdgePainter(this.positions, {required this.vertical});

  final Map<String, Offset> positions;
  final bool vertical;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = DemoColors.line
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    final w = _nodeSize.width, h = _nodeSize.height;
    for (final MapEntry(key: to, value: froms) in providerGraph.entries) {
      for (final from in froms) {
        // Out of the source's far side, into the target's near side.
        final a =
            positions[from]! + (vertical ? Offset(w / 2, h) : Offset(w, h / 2));
        final b =
            positions[to]! + (vertical ? Offset(w / 2, 0) : Offset(0, h / 2));
        final path = Path()..moveTo(a.dx, a.dy);
        final arrow = Path();
        if (vertical) {
          final mid = (a.dy + b.dy) / 2;
          path.cubicTo(a.dx, mid, b.dx, mid, b.dx, b.dy);
          arrow
            ..moveTo(b.dx - 4, b.dy - 7)
            ..lineTo(b.dx, b.dy)
            ..lineTo(b.dx + 4, b.dy - 7);
        } else {
          final mid = (a.dx + b.dx) / 2;
          path.cubicTo(mid, a.dy, mid, b.dy, b.dx, b.dy);
          arrow
            ..moveTo(b.dx - 7, b.dy - 4)
            ..lineTo(b.dx, b.dy)
            ..lineTo(b.dx - 7, b.dy + 4);
        }
        canvas
          ..drawPath(path, paint)
          ..drawPath(arrow, paint);
      }
    }
  }

  @override
  bool shouldRepaint(_EdgePainter old) =>
      old.positions != positions || old.vertical != vertical;
}
