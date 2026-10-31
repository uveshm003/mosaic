import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

/// How a new screen arrives.
enum PageTransition {
  material('Material', 'MaterialPageRoute'),
  fade('Fade', 'FadeTransition'),
  slideUp('Slide up', 'SlideTransition'),
  scale('Scale', 'ScaleTransition');

  const PageTransition(this.label, this.widget);

  final String label;
  final String widget;
}

class _Place {
  const _Place(this.name, this.icon, this.color, this.blurb);

  final String name;
  final IconData icon;
  final Color color;
  final String blurb;
}

const _places = [
  _Place(
    'Inbox',
    Icons.inbox_outlined,
    DemoColors.mint,
    'Messages waiting for a reply.',
  ),
  _Place(
    'Routes',
    Icons.route_outlined,
    DemoColors.coral,
    'Today’s planned stops.',
  ),
  _Place(
    'Photos',
    Icons.photo_library_outlined,
    Color(0xFFA78BFA),
    'Shots from the last visit.',
  ),
  _Place(
    'Sync',
    Icons.sync,
    Color(0xFFFBBF24),
    'Changes queued while offline.',
  ),
  _Place(
    'Reports',
    Icons.insert_chart_outlined,
    Color(0xFF60A5FA),
    'Weekly numbers, ready to share.',
  ),
  _Place(
    'Settings',
    Icons.settings_outlined,
    Color(0xFFF472B6),
    'Account and device options.',
  ),
];

class TransitionsPage extends StatefulWidget {
  const TransitionsPage({super.key});

  @override
  State<TransitionsPage> createState() => _TransitionsPageState();
}

class _TransitionsPageState extends State<TransitionsPage> {
  var _transition = PageTransition.material;

  Route<void> _route(_Place place) {
    Widget page(BuildContext _) => _DetailPage(place: place);
    if (_transition == PageTransition.material) {
      return MaterialPageRoute(builder: page);
    }
    return PageRouteBuilder(
      transitionDuration: const Duration(milliseconds: 450),
      reverseTransitionDuration: const Duration(milliseconds: 350),
      pageBuilder: (context, _, _) => page(context),
      transitionsBuilder: (context, animation, _, child) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: Curves.easeInOutCubicEmphasized,
        );
        return switch (_transition) {
          PageTransition.fade => FadeTransition(opacity: curved, child: child),
          PageTransition.slideUp => SlideTransition(
            position: Tween(
              begin: const Offset(0, 1),
              end: Offset.zero,
            ).animate(curved),
            child: child,
          ),
          PageTransition.scale => ScaleTransition(
            scale: Tween(begin: 0.85, end: 1.0).animate(curved),
            child: FadeTransition(opacity: curved, child: child),
          ),
          PageTransition.material => child,
        };
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return PageBody(
      children: [
        Text('Transitions & Hero', style: text.headlineSmall),
        const SizedBox(height: 4),
        Text(
          'Tap a tile. The icon flies to the next screen with a Hero while the page '
          'arrives with the transition you pick.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        SegmentedButton<PageTransition>(
          segments: [
            for (final t in PageTransition.values)
              ButtonSegment(value: t, label: Text(t.label)),
          ],
          selected: {_transition},
          showSelectedIcon: false,
          onSelectionChanged: (s) => setState(() => _transition = s.first),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: MediaQuery.sizeOf(context).width < 520 ? 2 : 3,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.3,
          children: [
            for (final place in _places)
              Card(
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: () => Navigator.of(context).push(_route(place)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Hero(
                          tag: place.name,
                          child: Icon(place.icon, size: 32, color: place.color),
                        ),
                        const Spacer(),
                        Text(place.name, style: text.titleMedium),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 16),
        CodeBlock(
          _transition == PageTransition.material
              ? 'Navigator.push(context, MaterialPageRoute(\n'
                    '  builder: (_) => DetailPage(),\n'
                    '));\n\n'
                    '// Both screens wrap the icon in\n'
                    'Hero(tag: place.name, child: Icon(place.icon))'
              : 'Navigator.push(context, PageRouteBuilder(\n'
                    '  pageBuilder: (_, _, _) => DetailPage(),\n'
                    '  transitionsBuilder: (_, animation, _, child) =>\n'
                    '      ${_transition.widget}(/* animation */, child: child),\n'
                    '));\n\n'
                    '// Both screens wrap the icon in\n'
                    'Hero(tag: place.name, child: Icon(place.icon))',
        ),
      ],
    );
  }
}

class _DetailPage extends StatelessWidget {
  const _DetailPage({required this.place});

  final _Place place;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: Text(place.name)),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Hero(
              tag: place.name,
              child: Icon(place.icon, size: 120, color: place.color),
            ),
            const SizedBox(height: 24),
            Text(place.name, style: text.headlineMedium),
            const SizedBox(height: 8),
            Text(
              place.blurb,
              style: text.bodyLarge?.copyWith(color: DemoColors.muted),
            ),
            const SizedBox(height: 24),
            OutlinedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Back'),
            ),
          ],
        ),
      ),
    );
  }
}
